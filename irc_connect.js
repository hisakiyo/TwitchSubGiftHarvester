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
	autoRejoin: false,
	autoConnect: true,
	floodProtection: true,
	floodProtectionDelay: 3000
};

console.log(config.channels[0])

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


function msg(from, channel, text, message)
{
/*	if (text == "test") {
		console.log(channel + " - input: test - output: Test successful");
		botClient.send("PRIVMSG" , channel, "Test successful");
	}
*/
}


function err(message)
{
	console.log("Error: ", message);
}

botClient.addListener("message", msg);
botClient.addListener("action", msg);
botClient.addListener("join", join);
botClient.addListener("error", err);


