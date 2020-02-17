const fetch = require('node-fetch')
const fs = require('fs')
const puppeteer = require('puppeteer');
const userFile = 'user.json' // file where usernames will be registered
const language = 'fr' // fr-en-es ...
const oauthTwitch = '' // oauth:xxxxxxxxxxxxxxxxxxxxxxxx
const userTwitch = '' // twitch username
const countChannel = 100 // number of channel (100,200,300...1000)
const countLiveChannel = 10 // Nombre de chaine connectées en tout 
var minutes = 60, interval = minutes * 60 * 1000 // time between updates

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const cookies = []; // copiez ici les cookies twitch importés depuis EditThisCookie

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
var run = async (j,users) => {
		  const browser = await puppeteer.launch({
			  executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
			});
		  var i=0
		  const page = await browser.newPage();
		  await page.setCookie(...cookies)
		  await page.goto('https://www.twitch.tv/'+users[j].replace("#",""), {waitUntil: 'networkidle2'});
		  try{
			await page.click('button[data-a-target=player-overlay-mature-accept]');
		  } catch(e){
		  }
		  await page.click('div[data-test-selector=settings-menu-button__animate-wrapper]');
		  await page.click('button[data-a-target=player-settings-menu-item-quality]');
		  await page.click('div.tw-pd-05:nth-child(9)');
		  while(true){
			if(i%100==0){
				try {
					console.log(users[j].replace("#","")+" :"+(await page.$eval('p[data-test-selector=balance-string]', e => e.innerText)) + " points");
				} catch(e) {
					console.log("Balance non trouvée pour "+users[j]);
				}
			}
            // On vérifie toutes les secondes si il y a un nouveau bonus
			try{ 
				await page.click('div.claimable-bonus__icon');	
				console.log("Le petit bonus qui fait plaisir pour la chaine de "+users[j].replace("#",""))
			} catch(e){
			}
			await timeout(1000)
			i++
		  }
		};
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

function connect_irc(){
    var users = fs.readFileSync(userFile).toString();
    users = JSON.parse(users);
	for(j=0; j<countLiveChannel; j++){
		run(j,users);
	}
}

setInterval(function x() {
    fetch_users().then(function() {
        connect_irc()
    })
    return x
}(), interval)
