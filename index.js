const express = require('express');
const compression = require('compression');
const cheerio = require('cheerio')
const got = require('got')

const app = express()
const PORT = process.env.PORT || 8000

app.use(compression())

const page = 'https://liquipedia.net/pubg/LOCO_War_of_Glory/Grand_Finals'

app.get('/pmpl', async (req,res)=>{
  try {

    let tournament = {
      title: String,
      logo: String,
      prizePool: String,
      teams: [{
        name: String,
        logo: String,
        players: Array
      }]
  }

    const response = await got(page)

    const $ = cheerio.load(response.body);

    tournament.title = $('h1.firstHeading').text()
    tournament.prizePool = $('h1.firstHeading').text()
    tournament.logo = 'https://liquipedia.net' + $('.infobox-image > .center img').attr('src')

    $('div.teamcard').each((i,x)=>{
      tournament.teams[i] =  {name : $(x).find('center a').text()}
      tournament.teams[i].logo = 'https://liquipedia.net' + $(x).find('.logo img').attr('src')
      
      let players = []
      $(x).find('.list td > a').each((j,y)=> {
        players.push($(y).text())
        tournament.teams[i].player = players
      })
    })

    res.json(tournament)
  } catch (error) {
    throw error
  }
})


app.listen(PORT, ()=> console.log('Server on'))