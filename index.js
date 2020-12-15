const { get, patch } = require('axios')
const fs = require('fs')
const chalk = require('chalk')
require('dotenv').config()

console.log(`${chalk.green('>')} Readying up...`)

setInterval(() => {
  if (process.env.TOKEN) {
    main()
    setInterval(() => main, 8000)
  }
}, 8000)

function daysUntil (date) {
  const ms = Math.floor(date - new Date())
  const days = Math.floor(ms / (24 * 60 * 60 * 1000))
  return days
}

Date.prototype.addHours = function(h) {
  this.setHours(this.getHours() + h)
  return this
}

function daysUntilChristmas () {
  let date = new Date(Date.parse(`12/25/${new Date().getUTCFullYear()}`))
  const current = new Date()
  if (current.getMonth() >= 11) {
    if (current.getDate() > 25) {
      date = new Date(Date.parse(`12/25/${new Date().getUTCFullYear() + 1}`))
    } else if (current.getDate() === 25) {
      return "It's Christmas"
    }
  }
  return (daysUntil(date) + 1).toString()
}

function setStatus (emoji, text, expiresAt) {
  patch(
    'https://canary.discordapp.com/api/v6/users/@me/settings',
    {
      custom_status: {
        text: text,
        expires_at: expiresAt,
        emoji_name: emoji
      }
    },
    {
      headers: {
        Authorization: process.env.TOKEN,
        'Content-Type': 'application/json'
      }
    }
  ).then(() => {
    console.log(`${chalk.green('>')} Dispatched status event for the current date, it expires in 4 hours. Next dispatch in 8 seconds...`)
  }).catch(() => {
    console.log(`${chalk.red('>')} Failed to dispatch custom status, is your token set or up to date?`)
  })
}

async function main () {
  if (daysUntilChristmas() !== "It's Christmas") {
    setStatus("🎄", `${daysUntilChristmas()} days until Christmas`, new Date().addHours(4).toISOString())
  } else {
    setStatus("🎄", `It's Christmas`, new Date().addHours(4).toISOString())
  }
}
