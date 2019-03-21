const config = require("../../config.json");
const request = require("request");
const cheerio = require("cheerio");

let Supreme = {};

Supreme.getProductList = (desktopUrl, proxy, callback) => {
  request(
    {
      url: desktopUrl,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
        Connection: "keep-alive"
      },
      proxy: proxy,
      gzip: true
    },
    (err, res, body) => {
      if (!err && res.statusCode == 200) {
        const $ = cheerio.load(body);
        const productList = $("div.inner-article");

        return callback(null, productList);
      } else {
        return callback(err, null);
      }
    }
  );
};

Supreme.getProductData = (productLink, proxy, callback) => {
  request(
    {
      url: productLink,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
        Connection: "keep-alive"
      },
      proxy: proxy,
      gzip: true
    },
    (err, res, body) => {
      if (!err && res.statusCode == 200) {
        const $ = cheerio.load(body);

        // if locale set to US
        if (config.locale == "en_US") {
          var size = $("select#s")
            .text()
            .split("\n");
        }

        // if locale set to GB
        if (config.locale == "en_GB") {
          var size = $("select#size")
            .text()
            .split("\n");
        }

        const title = $("div#details")
          .children("h1")
          .text();

        const color = $("div#details")
          .children("p.style")
          .text();

        const price = $("div#details")
          .children("p.price")
          .children("span")
          .text()
          .trim();

        return callback(null, { size, title, color, price });
      } else {
        return callback(err, null);
      }
    }
  );
};

Supreme.checkSizeAvailability = () => {};

module.exports = Supreme;
