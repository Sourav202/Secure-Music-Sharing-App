/*
(c) 2023 Louis D. Nel
Based on:
https://socket.io
see in particular:
https://socket.io/docs/
https://socket.io/get-started/chat/
*/
//import necessary modules
const express = require('express')
const http = require('http')
const PORT = process.env.PORT || 3000 //allow environment variable to possible set PORT
const app = express()
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const routes = require('./private/index')
const sqlite3 = require("sqlite3")
const db_1200iRealSongs = new sqlite3.Database('./data/db_1200iRealSongs', sqlite3.OPEN_READWRITE)

//config for hbs as view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs') //use hbs handlebars wrapper

//Middleware
app.use(express.static(__dirname + '/public')) //static server
app.use(express.urlencoded({extended: true}))

//get method to register a new user(bypasses the general auth checks)
app.get('/userSignUp', (request, response) => {
  response.render("userSignUp", { title: "User Sign Up" })
})

//post request to handle new user
app.post('/addUser', (request, response) => {
  const userid = request.body.username;
  const password = request.body.password;
  const role = "guest";

  db_1200iRealSongs.run(`INSERT INTO users (userid, password, role) VALUES (?, ?, ?)`, [userid, password, role], function(err) {
      db_1200iRealSongs.all(`SELECT * FROM users`, [], (err, rows) => {
          console.log({
            message: "new user registered", 
            data: rows
          })
          response.redirect("/myTunes")
      })
  })
})

//authenticate user for the following get methods
app.use(routes.authenticate)
//fav icon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
//for logging
app.use(logger('dev'))
//route to show registered users (only accessible to the admin)
app.get('/registeredUsers', routes.authenticateAdmin, routes.users);
//route playlist application using iTunes API
app.get("/mytunes", routes.authenticate, (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})
app.get('/notValid', (request, response) => {
  response.render('notValid', { title: 'Invalid User Dectected!' })
})
//API get request
app.get('/songs', (request, response) => {
  console.log(request.path)
  let songTitle = request.query.title
  let titleWithPlusSigns = songTitle.trim().replace(/\s/g, '+')
  console.log('titleWithPlusSigns: ' + titleWithPlusSigns)

  console.log('query: ' + JSON.stringify(request.query))
  if(!songTitle) {
    //send json response to client using response.json() feature
    //of express
    response.json({message: 'Please enter Song Title'})
    return
  }

//http://itunes.apple.com/search?term=Body+And+Soul&&entity=musicTrack&limit=20
  const options = {
    "method": "GET",
    "hostname": "itunes.apple.com",
    "port": null,
    "path": `/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=100`,
    "headers": {
      "useQueryString": true
    }
  }
  //create the actual http request and set up
  //its handlers
  http.request(options, function(apiResponse) {
    let songData = ''
    apiResponse.on('data', function(chunk) {
      songData += chunk
    })
    apiResponse.on('end', function() {
      response.contentType('application/json').json(JSON.parse(songData))
    })
  }).end() //important to end the request
           //to actually send the message
})

//start server and provide hyperlinks
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:`)
    console.log('http://localhost:3000/userSignUp')
  }
})
