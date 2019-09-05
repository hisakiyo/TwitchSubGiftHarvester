/* Fetch 100 streamers by views*/

const https = require('https')
const fs = require('fs');

const oauth = ''

const options = {
  hostname: 'api.twitch.tv',
  port: 443,
  path: '/kraken/streams/?limit=100',
  method: 'GET',
  headers: {
    'Accept' : 'application/vnd.twitchtv.v5+json',
    'Client-ID' : 'zsujit5vv4gtew8k6snn8xr0pb7q9a'
  }
};


const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
        data+=chunk;
  });
  res.on('end', () => {


fs.writeFile('user.txt', '[', function (err) {
  if (err) throw err;
});

        var dparse = JSON.parse(data)
        for(var i=0;i<100;i++){
                var user = dparse.streams[i].channel.name
		if(i<99){
		fs.appendFile("user.txt", '\"#' + user+ '\"' + ',', function(err) {
    			if(err) {
        			return console.log(err);
	    		}
		}); 
		} else {
		fs.appendFile("user.txt", '\"#' + user+ '\"' + ']', function(err) {
                        if(err) {
                                return console.log(err);
                        }
                });
		console.log("Fichier sauvegardé");
	        }
	}
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.end();
