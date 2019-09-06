const fetch = require('node-fetch')
const fs = require('fs')

const userFile = 'user.json'
const save = async newUsers => {
  const savedUsers = JSON.parse((await fs.promises.readFile(userFile, 'utf8')) || '[]')
  const allUsers = [...savedUsers, ...newUsers]
  console.log(`Usernames count: ${allUsers.length}\n`)
  return fs.promises.writeFile(userFile, JSON.stringify(allUsers))
}

const setup = async () => {
  let cursor = null
  // loop through first 1000 members
  for (let i = 0; i < 10; i++) {
    console.log(`Cursor: ${cursor}`)

    const users = await fetch(`https://api.twitch.tv/helix/streams?first=100${cursor ? `&after=${cursor}` : ''}`, {
      headers: {
        'Client-ID': 'zsujit5vv4gtew8k6snn8xr0pb7q9a'
      }
    }).then(res => res.json())

    // Save current cursor 100 usernames
    await save(users.data.map(aUser => aUser.user_name))
    cursor = users.pagination.cursor
  }
}

setup()
