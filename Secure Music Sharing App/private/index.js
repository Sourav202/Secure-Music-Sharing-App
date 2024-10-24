//import necessary modules
const url = require('url')
const sqlite3 = require('sqlite3').verbose() //verbose provides more detailed stack trace
const db = new sqlite3.Database('data/db_1200iRealSongs')

//notice navigation to parent directory:
const headerFilePath = __dirname + '/../views/header.html'
const footerFilePath = __dirname + '/../views/footer.html'

//general authentication to run for guests and admin alike(does not allow unregistered users)
exports.authenticate = function(request, response, next) {
	//Middleware to do BASIC http 401 authentication
  let auth = request.headers.authorization
  // auth is a base64 representation of (username:password)
  //so we will need to decode the base64
  if (!auth) {
    //note here the setHeader must be before the writeHead
    response.setHeader('WWW-Authenticate', 'Basic realm="need to login"')
    response.writeHead(401, {
      'Content-Type': 'text/html'
    })
    console.log('No authorization found, send 401.')
    response.end();
  } else {
    console.log("Authorization Header: " + auth)
    //decode authorization header
    // Split on a space, the original auth
    var tmp = auth.split(' ')

    // create a buffer and tell it the data coming in is base64
    var buf = Buffer.from(tmp[1], 'base64');

    // read it back out as a string
    var plain_auth = buf.toString()
    console.log("Decoded Authorization ", plain_auth)

    //extract the userid and password as separate strings
    var credentials = plain_auth.split(':')
    var username = credentials[0]
    var password = credentials[1]
    console.log("User: ", username)
    console.log("Password: ", password)

    var authorized = false
    //check database users table for user
    db.all("SELECT userid, password FROM users", function(err, rows) {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].userid == username && rows[i].password == password) {
          authorized = true
        }
      }
      if (authorized == false) {
        //we had an authorization header by the user:password is not valid
        response.setHeader('WWW-Authenticate', 'Basic realm="need to login"')
        response.writeHead(401, {
          'Content-Type': 'text/html'
        })
        console.log('No authorization found, send 401.')
        response.end()
      } else
        next()
    })
  }
}

//admin authentication admins (does not allow unregistered users/guests)
exports.authenticateAdmin = function(request, response, next) {
	//Middleware to do BASIC http 401 authentication
  let auth = request.headers.authorization
  // auth is a base64 representation of (username:password)
  //so we will need to decode the base64
  if (!auth) {
    //note here the setHeader must be before the writeHead
    response.setHeader('WWW-Authenticate', 'Basic realm="need to login"')
    response.writeHead(401, {
      'Content-Type': 'text/html'
    })
    console.log('No authorization found, send 401.')
    response.end();
  } else {
    console.log("Authorization Header: " + auth)
    //decode authorization header
    // Split on a space, the original auth
    var tmp = auth.split(' ')

    // create a buffer and tell it the data coming in is base64
    var buf = Buffer.from(tmp[1], 'base64');

    // read it back out as a string
    var plain_auth = buf.toString()
    console.log("Decoded Authorization ", plain_auth)

    //extract the userid and password as separate strings
    var credentials = plain_auth.split(':')
    var username = credentials[0]
    var password = credentials[1]
    console.log("User: ", username)
    console.log("Password: ", password)

    var authorized = false
    //check database users table for user
    db.all("SELECT userid, password, role FROM users", function(err, rows) {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].userid == username && rows[i].password == password && rows[i].role === 'admin') {
          authorized = true
          request.user_role = rows[i].role
        }
      }
      if (authorized == false) {
        response.redirect('/notValid');
        console.log('No authorization found')
      } else
        next()
    })
  }
}

function parseURL(request, response) {
  const PARSE_QUERY = true //parseQueryStringIfTrue
  const SLASH_HOST = true //slashDenoteHostIfTrue
  let urlObj = url.parse(request.url, PARSE_QUERY, SLASH_HOST)
  console.log('path:')
  console.log(urlObj.path)
  console.log('query:')
  console.log(urlObj.query)
  return urlObj
}

//query the database for all users and their respective information, rendered using hbs
exports.users = function(request, response) {
  // /users
  db.all("SELECT userid, password FROM users", function(err, rows) {
    response.render('registeredUsers', {
      title: 'List of registered users:',
      userEntries: rows
    })
  })
}

//query the user to sign up, stores the information in the db
exports.signUp = function(request, response) {
  if (request.user) {
    //user is already signed in
    response.redirect("/mytunes")
  } else {
    //direct to sign up page, rendered using hbs
    response.render("userSignUp", {
      title: "User Sign Up!"
    })
  }
}
