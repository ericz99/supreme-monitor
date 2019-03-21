const request = require("request");
const dateFormat = require("dateformat");

module.exports = {
  sentNotification: (
    { productLink, title, imageUrl, color, size, price, qt },
    type,
    config,
    headers,
    shop
  ) => {
    let opts = {
      url: config.discord_webhook,
      method: "POST",
      headers: headers,
      json: {
        embeds: [
          {
            author: {
              name: "Supreme Monitor (US)"
            },
            title: `${type}: ${title}`,
            url: productLink,
            color: 11796684,
            footer: {
              text: `Supreme Monitor | ${dateFormat(
                new Date(),
                "yyyy-mm-dd HH:MM:ss:l"
              )}`
            },
            thumbnail: {
              url: `${imageUrl}`
            },
            fields: [
              {
                name: "Shop",
                value: `[Supreme](${shop})`,
                inline: true
              },
              {
                name: "Sizes",
                value: size,
                inline: true
              },
              {
                name: "Colour",
                value: color,
                inline: true
              },
              {
                name: "Price",
                value: price,
                inline: true
              },
              {
                name: "Quick Tasks",
                value: `[CYBER](${qt.cyberQt}) | [PD](${qt.pdQt}) | [AURORA](${
                  qt.auoraQt
                })`,
                inline: true
              }
            ]
          }
        ]
      }
    };

    // send notification
    request(opts);
  }
};
