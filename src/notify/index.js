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
      url: config.discord.discord_webhook,
      method: "POST",
      headers: headers,
      json: {
        username: config.discord.webhook_username,
        avatar_url: config.discord.avatar_url,
        embeds: [
          {
            author: {
              name: "Supreme Monitor (US)"
            },
            title: `${type}: ${title}`,
            url: productLink,
            color: 11796684,
            footer: {
              text: `${config.discord.footer_text} | ${dateFormat(
                new Date(),
                "yyyy-mm-dd HH:MM:ss:l"
              )}`,
              icon_url: config.discord.footer_icon_url
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
                value: `[CYBER](${qt.cyberQt}) | [PD](${qt.pdQt}) | [TKS](${qt.tksQt})`,
                inline: true
              }
            ]
          }
        ]
      }
    };

    setTimeout(request, 600, opts);

    // send notification
    // request(opts);
  }
};
