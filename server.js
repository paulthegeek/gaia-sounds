const _ = require('lodash')
const async = require('async')
const express = require('express')
const request = require('request')
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();
const countryIds = [
    '37i9dQZEVXbMMy2roB9myp', '37i9dQZEVXbJPcfkRz0wJ0', '37i9dQZEVXbKNHh6NIXu36', '37i9dQZEVXbJNSeeHswcKB',
    '37i9dQZEVXbJqfMFK4d691', '37i9dQZEVXbMXbN3EUUhlg', '37i9dQZEVXbKj23U1GF4IR', '37i9dQZEVXbL0GavIqMTeb', 
    '37i9dQZEVXbOa2lmxNORXQ', '37i9dQZEVXbMZAjGMynsQX', '37i9dQZEVXbIP3c3fqVrJY', '37i9dQZEVXbL3J0k32lWnN',
    '37i9dQZEVXbKAbrMR8uuf7', '37i9dQZEVXbJlM6nvL1nD1', '37i9dQZEVXbLxoIml4MYkT', '37i9dQZEVXbLesry2Qw2xS',
    '37i9dQZEVXbMxcczTSoGwZ', '37i9dQZEVXbIPWwFssbupI', '37i9dQZEVXbJiZcmkrIHGU', '37i9dQZEVXbJqdarpmTJDL',
    '37i9dQZEVXbLy5tBFyQvd4', '37i9dQZEVXbJp9wcIM9Eo5', '37i9dQZEVXbLwpL8TjsxOG', '37i9dQZEVXbNHwMxAkvmF8',
    '37i9dQZEVXbKMzVsSGQ49S', '37i9dQZEVXbObFQZ3JLcXt', '37i9dQZEVXbKM896FDX8L1', '37i9dQZEVXbIQnj7RRhdSX',
    '37i9dQZEVXbKXQ4mDTEBXq', '37i9dQZEVXbJWuzDrTxbKS', '37i9dQZEVXbMx56Rdq5lwc', '37i9dQZEVXbJlfUljuZExa',
    '37i9dQZEVXbO3qyFxbkOE1', '37i9dQZEVXbKCF6dqVpDkS', '37i9dQZEVXbM8SIrkERIYl', '37i9dQZEVXbJvfa0Yxg7E7',
    '37i9dQZEVXbKypXHVwk1f0', '37i9dQZEVXbNOUPGj7tW6T', '37i9dQZEVXbJfdy5b0KP7W', '37i9dQZEVXbNBz9cRCSFkY',
    '37i9dQZEVXbN6itCcaL3Tt', '37i9dQZEVXbKyJS56d1pgi', '37i9dQZEVXbK4gjvS1FjPY', '37i9dQZEVXbKIVTPX9a2Sb',
    '37i9dQZEVXbNFJfN1Vw8d9', '37i9dQZEVXbLoATJ81JYXz', '37i9dQZEVXbJiyhoAPEfMK', '37i9dQZEVXbMnZEatlMSiu',
    '37i9dQZEVXbMnz8KIWsvf9', '37i9dQZEVXbIVYVBNw9D5K', '37i9dQZEVXbLnolsZ8PSNw', '37i9dQZEVXbLRQDuF5jeBp',
    '37i9dQZEVXbMJJi3wgRbAy'
  ]

let token = ''
let encodedClientIdSecret = new Buffer(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')

const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': `Basic ${encodedClientIdSecret}`,
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  },
  form: {
    grant_type: 'client_credentials'
  }
}

let authCredentials = {
  accessToken: '',
  expiration: new Date()
}

app.listen(process.env.PORT)

app.use(express.static('public'));

app.use(function(req, res, next) {
  if (!(authCredentials.accessToken.length > 0 && authCredentials.expiration < new Date())) {
    request.post(authOptions, (error, response, body) => {
      if(!error && response.statusCode === 200) {
        let currentDate = new Date()
        token = JSON.parse(body).access_token
        authCredentials.accessToken = token
        authCredentials.expiration = new Date() + (3300 * 1000)
        next()
      }
    })
  } else {
    next()
  }
})

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/playlist", (request, response) => {
  const randomIndex = Math.floor(Math.random() * (countryIds.length - 1))
  const countryId = countryIds[randomIndex]
  let playlist = {}
  let spotifyApi = new SpotifyWebApi({
    accessToken: token
  });
  
  spotifyApi.getPlaylist('spotifycharts', countryId)
      .then((playlistData) => {
        let playlist = playlistData.body
        let tracks = _.filter(playlist.tracks.items, (item) => {
          return item.track.preview_url !== null;
        })
    
        playlist = {
          image: playlist.images[0].url,
          name: playlist.name,
          tracks: tracks.slice(1,4)
        }
    
      response.send(playlist)
    
    }, (error) => {
      console.log('Something went wrong!', error)
    })
});