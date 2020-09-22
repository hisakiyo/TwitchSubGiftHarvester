const fetch = require('node-fetch')
const fs = require('fs')
const irc = require('irc');
const userFile = 'user.json' // file where usernames will be registered
const language = 'fr' // fr-en-es ...
const oauthTwitch = '' // oauth:xxxxxxxxxxxxxxxxxxxxxxxx
const userTwitch = '' // twitch username
const countChannel = 100 // number of channel (100,200,300...1000)
var minutes = 15, interval = minutes * 60 * 1000 // time between updates

var config = {
    channels: "",
    server: "irc.chat.twitch.tv",
    oauth: oauthTwitch,
    botName: userTwitch,
    autoRejoin: false,
    autoConnect: true,
    floodProtection: true,
    floodProtectionDelay: 3000
}

const save = async newUsers => {
    const savedUsers = JSON.parse((await fs.promises.readFile(userFile, 'utf8')) || '[]')
    const allUsers = [...savedUsers, ...newUsers]
    console.log(`Usernames count: ${allUsers.length}\n`)
    return fs.promises.writeFile(userFile, JSON.stringify(allUsers))
}

async function fetch_users(){
        let cursor = null
        fs.writeFile(userFile, '', function(){console.log('File is now empty.')})
        for (let i = 0; i < countChannel/100; i++) {
            console.log(`Cursor: ${cursor}`)
            const users = await fetch(`https://api.twitch.tv/helix/streams?first=100&language=${language}${cursor ? `&after=${cursor}` : ''}`, {
                headers: {
                        'Client-ID': 'zsujit5vv4gtew8k6snn8xr0pb7q9a'
                }
            }).then(res => res.json())
            await save(users.data.map(aUser => "#"+aUser.user_name.toLowerCase()))
            cursor = users.pagination.cursor
        }
        return new Promise((resolve) => { resolve()})
}

function join(channel, nick, msgobj){
        if (nick.toLowerCase() == config.botName.toLowerCase())
            console.log("Bot has joined channel", channel)
}

function err(message){
        // skip whois error
        message.args[1] != "WHOIS" ? console.log(message) : true
}

function connect_irc(){
    var users = fs.readFileSync(userFile).toString();
    users = JSON.parse(users)
    config.channels = users,
    botClient = new irc.Client(config.server, config.botName, {
        channels: config.channels,
        password: config.oauth
    })
    botClient.addListener("join", join)
    botClient.addListener("error", err)
}

connect_irc()
