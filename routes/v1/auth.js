let Router = require('express').Router;
let passport = require ('passport')
let User = require('../../db/v1/userSchema.js')
let checkAuth = require('../../config/middleware.js').checkAuth

const auth = Router()

auth
  .post('/register', function(req, res){
    // passport appends json-data to request.body
    console.log(req.body)
    let newUser = new User(req.body)

    User.find({email: req.body.email}, function(err, results){
      if (err) return res.status(500).json(err)

      if(results !== null && results.length > 0 ) {
        return res.status(401).send(`oops, record for <${req.body.email}> already exists`)
      }

      newUser.save(function(err, record){
        if(err) return res.status(500).json(err)
        let userCopy = newUser.toObject()
        delete userCopy.password
        res.json(userCopy)
      })
    })
  })

auth
  .get('/current', function (req, res) {
    if (req.user) res.json({user: req.user});
    else res.json({user: null})
  })
  .post('/login', function(req,res,next){
    passport.authenticate('local', function(err,user,info) {
      if (err || !user) {
        console.log(err)
        res.status(400).send('incorrect email/password combination')
        return
      }
      else {
        req.login(user,function(err) {
          if (err) {
            console.log(err)
            res.status(400).send(err)
            return
          }
          else {
            console.log('user', user)
            delete user.password //only sendibg back id since delete does nto work
            console.log('user', user)
            res.json({userId:user._id})
          }
        })
      }
      next()
    })(req,res,next)
  })
  .get('/logout', function (req, res) {
    if (req.user) {
      // console.log(req.user)
      let email = req.user.email
      req.logout()
      res.json({
        msg: `user <${email}> logged out`
      })
    }
    else {
      res.json({
        msg: 'error: no current user'
      })
    }
  })


module.exports = auth