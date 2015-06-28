var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/colorPalettes');
var paletteCollection = db.get('palettes')
var bcrypt = require('bcryptjs');
//var key = process.env.PIVOTAL_API;


/* GET home page. */
router.get('/', function(req, res, next) {
  paletteCollection.find({}, function(err, palettes){
    res.render('index', { title: 'Color Combos' });
  });
});

// Grab the Home Page for Users once logged in
router.get('/home', function(req,res,next){
  res.render('home');
});

// Check Validations for Create Account
router.post('/create', function(req, res, next){
  var array=[];
  // Username Validations - blank
  if(req.body.newUsername.trim() === ''){
    array.push('Username cannot be blank');
  }
  // New Password validations - blank
  if(req.body.newPassword === ''){
    array.push('Password cannot be blank');
    // Password length must be 8 characters
  } else if (req.body.newPassword.length < 8 || req.body.newPassword.length > 30){
     array.push('Password must be 8 characters long, but less than 30 characters');
    // password must not match email
  } else if (req.body.newPassword === req.body.newEmail){
      array.push('Password cannot be email')
  }

  // Confirm Password validations - blank
  if(req.body.confirm === ''){
    array.push('Please confirm password')
    // Password must match confirmation
  } else if(req.body.confirm != req.body.newPassword){
    array.push('Confirmation must match password')
  }

  // if Errors, render index page with errors
  if(array.length > 0){
    console.log(array);
    res.render('', { title: 'Color Combos', errors: array})
  }
  else {
    paletteCollection.find({}, function(err, palettes){
      var errorArray = [];
      for(var i =0; i< palettes.length; i++){
        if(req.body.newUsername.toUpperCase() === palettes[i].username.toUpperCase()){
          errorArray.push('Username ID already exists');
          res.render('', {title: 'Color Combos', errors: errorArray})
        }
      }
      if (errorArray.length === 0 || palettes.length === 0) {
        paletteCollection.insert({
          username: req.body.newUsername,
          password: bcrypt.hashSync(req.body.newPassword, 8)
        });
        res.redirect('/home');
      }
   });

  }
});

module.exports = router;
