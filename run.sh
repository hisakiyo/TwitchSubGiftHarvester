#!/bin/bash
sudo pkill -f TwitchBot/irc_connect.js || echo "Process was not running."
node fetch_users.js
node irc_connect.js &
