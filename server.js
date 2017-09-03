const PROJECT_NAME = 'base_proxy'

// x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x


const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load Configuration
const appMiddleWare = require('./config/middleware.js')
const appSecrets = require('./config/secrets.js')
const appAuthentication = require('./config/auth.js')
const connectToDB = require('./config/db-setup.js').connectToDB

// Import Routers
const authRouter = require('./routes/v1/auth.js')
const itemRouter = require('./routes/v1/item.js')
const userDetailRouter = require('./routes/v1/userDetail.js')
const userRouter = require('./routes/v1/user.js')

// Load DB User Model (for appAuthentication configuration)
const User = require('./db/v1/userSchema.js')


// =========
// RUN APP
// =========
const app = express()
const PORT = 8080
app.set('port', PORT)

// =========
// DATABASE
// =========
connectToDB(PROJECT_NAME)

// =========
// APPLICATION MIDDLEWARE
// =========
app.use( express.static( __dirname + '/dist/assets') );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended: true}) );
app.use( cookieParser() );
app.use( session({secret: appSecrets.sessionSecret,
                  resave: true,
                  saveUninitialized: true })
      );
app.use( passport.initialize() );
app.use( passport.session() );
appAuthentication(User)
app.use( appMiddleWare.cookifyUser )
app.use( appMiddleWare.parseQuery )
//
// =========
// ROUTERS
// =========
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin",[ "http://localhost:9000"]);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", ["DELETE", "UPDATE", "GET", "PUT"]);
  next();
});

app.use( '/auth', authRouter )
app.use( '/items', itemRouter )
app.use( '/user', userRouter )

app.use(appMiddleWare.errorHandler);

app.listen(PORT,function() {
  console.log('\n\n===== listening for requests on port ' + PORT + ' =====\n\n')
})
