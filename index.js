const Logger = require("./src/logger");
const Supreme = require("./src/modules/Supreme");
const cheerio = require("cheerio");
const config = require("./config.json");
const notify = require("./src/notify");
const _ = require("underscore");
const parseUrl = require("parse-url");
const proxyUtil = require("./src/proxy");

var pollMS = config.pollMS;
var desktopUrl = `https://www.supremenewyork.com/shop/${config.search_status}`;
var intervalCount = 0;
var firstRun = true;
var logger = Logger("Supreme Monitor V2");
var oldStock = {};
var newStock = {};
var shop = "https://www.supremenewyork.com/shop";

var restockFound = false;
var newProduct = false;
var sizeUpdated = false;

/* GLOBAL HEADER */
let headers = {
  "Accept-Encoding": "gzip, deflate",
  "Accept-Language": "en-US,en;q=0.9",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  "Cache-Control": "max-age=0",
  Connection: "keep-alive"
};

/* INITIAL STOCK CHECKER */
function initialChecker() {
  const randomProxy =
    config.proxy.length > 0 ? proxyUtil.getRandomItem(config.proxy) : null;

  Supreme.getProductList(desktopUrl, randomProxy, (err, productList) => {
    if ((!err && productList !== null) || productList !== undefined) {
      const $ = cheerio.load(productList);

      productList.each(function() {
        const productLink = `https://www.supremenewyork.com${$(this)
          .children("a")
          .attr("href")
          .trim()}`;
        const imageUrl = `https:${$(this)
          .children("a")
          .children("img")
          .attr("src")}`;

        Supreme.getProductData(
          productLink,
          randomProxy,
          (err, { title, size, color, price }) => {
            if (!err) {
              oldStock[productLink] = {
                imageUrl,
                title,
                color,
                size,
                price
              };

              return oldStock;
            } else {
              setTimeout(() => {
                logger.red(
                  "Possible Proxy Error Connection... Retrying in 5 second..."
                );

                initialChecker();
              }, 5000);
            }
          }
        );
      });
    } else {
      logger.red("Possible Proxy Error Connection... Retrying in 5 second...");
      setTimeout(() => {
        initialChecker();
      }, 5000);
    }
  });
}

function startMonitor() {
  let t;
  // we have to set interval to keep this running..
  let interval = setInterval(
    (t = () => {
      // get random proxies
      const randomProxy =
        config.proxy.length > 0 ? proxyUtil.getRandomItem(config.proxy) : null;

      // since firstrun time is true, this will run until firstrun is false
      if (firstRun) {
        initialChecker();
        firstRun = false;
        logger.green("Initial check done!");
        logger.normal(`Poll Time: ${pollMS} MS`);
        logger.normal(`Using ${config.proxy.length} proxy`);
        logger.yellow("Running for restock!");
      } else {
        // we are getting full product list from supreme
        Supreme.getProductList(desktopUrl, randomProxy, (err, productList) => {
          if ((!err && productList !== null) || productList !== undefined) {
            const $ = cheerio.load(productList);

            productList.each(function() {
              const productLink = `https://www.supremenewyork.com${$(this)
                .children("a")
                .attr("href")
                .trim()}`;
              const imageUrl = `https:${$(this)
                .children("a")
                .children("img")
                .attr("src")}`;

              // get all data
              Supreme.getProductData(
                productLink,
                randomProxy,
                (err, { title, color, size, price }) => {
                  if (!err) {
                    newStock[productLink] = {
                      imageUrl,
                      title,
                      color,
                      size,
                      price
                    };

                    /* CHECK FOR NEWLY ADDED PRODUCT */
                    if (!oldStock.hasOwnProperty(productLink)) {
                      // update db and sent webhook
                      oldStock[productLink] = {
                        imageUrl,
                        title,
                        color,
                        size,
                        price
                      };

                      logger.blue(
                        `${title}: +${color}, +${updatedSizes} new item in stock!`
                      );

                      // set newProduct == true
                      newProduct = true;

                      if (newProduct) {
                        // store data so we can use it in our webhook
                        const data = {
                          qt: {
                            /*  Quick Task  */
                            cyberQt: `https://cybersole.io/dashboard/quicktask?url=${productLink}`,
                            pdQt: `https://api.destroyerbots.io/quicktask?url=${productLink}`,
                            auoraQt: `https://aurora-io.herokuapp.com/api/quicktask?options=supreme-url&input=${productLink}`
                          },
                          productLink,
                          color,
                          imageUrl,
                          title,
                          size,
                          price
                        };

                        // sent hook
                        notify.sentNotification(
                          data,
                          "NEW",
                          config,
                          headers,
                          shop
                        );
                      }
                    }

                    /* CHECK FOR RESTOCK */
                    if (oldStock.hasOwnProperty(productLink)) {
                      // check old stock to see if anything changed in the new stock
                      for (
                        var i = 0;
                        i < oldStock[productLink].size.length;
                        i++
                      ) {
                        // check if newstock size is different from oldstock
                        if (
                          newStock[productLink].size.indexOf(
                            oldStock[productLink].size[i]
                          ) === -1
                        ) {
                          console.log(true);
                          console.log(oldStock[productLink].size);
                          console.log(newStock[productLink].size);

                          // shallow copy new stock
                          const newArr = [...newStock[productLink].size];
                          // set that into old stock
                          oldStock[productLink].size = newArr;

                          // updated sizes
                          var updatedSizes = oldStock[productLink].size.join(
                            " / "
                          );

                          logger.blue(
                            `${title}: +${color}, +${updatedSizes} updated size!`
                          );

                          // set size updated to true
                          sizeUpdated = true;

                          // if sizeUpdated is true
                          if (sizeUpdated) {
                            const data = {
                              qt: {
                                /* Quick Tasks */
                                cyberQt: `https://cybersole.io/dashboard/quicktask?url=${productLink}`,
                                pdQt: `https://api.destroyerbots.io/quicktask?url=${productLink}`,
                                auoraQt: `https://aurora-io.herokuapp.com/api/quicktask?options=supreme-url&input=${productLink}`
                              },
                              productLink,
                              color,
                              imageUrl,
                              title,
                              size: updatedSizes,
                              price
                            };

                            // send notification
                            notify.sentNotification(
                              data,
                              "RESTOCK",
                              config,
                              headers,
                              shop
                            );
                          }
                        }
                      }

                      // check new stock to see if anything changed.
                      for (var i in newStock[productLink].size) {
                        if (
                          oldStock[productLink].size.indexOf(
                            newStock[productLink].size[i]
                          ) === -1
                        ) {
                          // oldStock[productLink].size.push(newStock[productLink].size[i]);

                          // this basically applies all sizes from new stock to oldstock
                          Array.prototype.push.apply(
                            oldStock[productLink].size,
                            newStock[productLink].size
                          );

                          // remove any duplicate values in the old database
                          oldStock[productLink].size = _.uniq(
                            oldStock[productLink].size,
                            false
                          );

                          const parsedCategory = parseUrl(
                            productLink
                          ).pathname.split("/")[2];

                          // updated sizes formatter
                          var updatedSizes = newStock[productLink].size.join(
                            " / "
                          );

                          logger.blue(
                            `${title}: +${color}, +${updatedSizes} is now instock!`
                          );
                          /* simply push the size from the old database if anything changes in the new stock */
                          restockFound = true;

                          // if restock is found
                          if (restockFound) {
                            const data = {
                              qt: {
                                /* Quick Tasks */
                                cyberQt: `https://cybersole.io/dashboard/quicktask?url=${productLink}`,
                                pdQt: `https://api.destroyerbots.io/quicktask?url=${productLink}`,
                                auoraQt: `https://aurora-io.herokuapp.com/api/quicktask?options=supreme-url&input=${productLink}`
                              },
                              productLink,
                              color,
                              imageUrl,
                              title,
                              size: updatedSizes,
                              price
                            };

                            // send notification
                            notify.sentNotification(
                              data,
                              "RESTOCK",
                              config,
                              headers,
                              shop
                            );
                          }
                        }
                      }
                    }
                  } else {
                    logger.red(
                      "Possible Proxy Error Connection... Retrying in 5 second..."
                    );
                    setTimeout(() => {
                      startMonitor();
                    }, 5000);
                  }
                }
              );
            });
          } else {
            logger.red(
              "Possible Proxy Error Connection... Retrying in 5 second..."
            );
            setTimeout(() => {
              startMonitor();
            }, 5000);
          }
        });
      }
      intervalCount++;
    }),
    pollMS
  );
  t();
}

startMonitor();
