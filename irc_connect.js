var irc = require("irc");
const fs = require("fs");
var users = fs.readFileSync("user.json").toString();
users = JSON.parse(users)
console.log(users)


var config = {
        channels: users,
        server: "irc.chat.twitch.tv",
        oauth: "oauth:",
        botName: "hisakiyo_",
        autoRejoin: true,                                                                                                                                                                                                                            autoConnect: true,
        floodProtection: true,
        floodProtectionDelay: 3000
};

var botClient = new irc.Client(config.server, config.botName, {
        channels: config.channels,
        password: config.oauth
});

function join(channel, nick, msgobj)
{
        if (nick.toLowerCase() == config.botName.toLowerCase())
        {
                console.log("Bot has joined channel", channel);
        }
}

function err(message)
{
        // skip whois error
        message.args[1] != "WHOIS" ? console.log(message) : true;
}

botClient.addListener("join", join);
botClient.addListener("error", err);
