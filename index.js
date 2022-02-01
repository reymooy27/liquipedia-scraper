const express = require('express');
const compression = require('compression');
const cheerio = require('cheerio')
const got = require('got')

const app = express()
const PORT = process.env.PORT || 8000

app.use(compression())
const page = 'https://liquipedia.net/pubg/PUBG_Global_Championship/2021'

app.get('/tournament', async (req,res)=>{
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

    const getInfo = (parameter)=>{
      let x = $('.infobox-cell-2').filter(function() {
        return $(this).text().trim() === parameter;
      }).next().text().trim();

      if(x === '' || undefined) return undefined

      return x
    }

    tournament.title = $('h1.firstHeading').text()
    tournament.logo = 'https://liquipedia.net' + $('.infobox-image > .center img').attr('src')
    tournament.series = getInfo('Series:')
    tournament.organizer = getInfo('Organizer:')
    tournament.type = getInfo('Type:')
    tournament.location = getInfo('Location:')
    tournament.venue = getInfo('Venue:')
    tournament.gameMode = getInfo('Game Mode:')
    tournament.platform = getInfo('Platform:')
    tournament.prizePool = getInfo('Prize Pool:')
    tournament.startDate = getInfo('Start Date:')
    tournament.endDate = getInfo('End Date:')

    $('div.teamcard').each((i,x)=>{
      tournament.teams[i] =  {name : $(x).find('center a').text()}
      tournament.teams[i].logo = 'https://liquipedia.net' + $(x).find('.logo img').attr('src')
      tournament.teams[i].qualifier =  $(x).find('.teamcard-qualifier a').text()
      
      let players = []
      $(x).find('.list td > a').each((j,y)=> {
        players.push($(y).text())
        tournament.teams[i].player = players
      })
    })

    console.log(tournament);

    res.json(tournament)
  } catch (error) {
    throw error
  }
})


app.listen(PORT, ()=> console.log('Server on'))