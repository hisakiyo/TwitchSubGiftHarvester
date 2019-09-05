#!/bin/bash
sudo pkill -f TwitchBot/irc_connect.js || echo "Process was not running."
node /home/pi/TwitchBot/fetch_users.js
node /home/pi/TwitchBot/irc_connect.js &
