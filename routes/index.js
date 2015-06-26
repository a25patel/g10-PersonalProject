var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/colorPalettes');
var paletteCollection = db.get('palettes')

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
  // Email Validations - blank
  if(req.body.newEmail.trim() === ''){
    array.push('Email cannot be blank');
  }
  // New Password validations - blank
  if(req.body.newPassword === ''){
    array.push('Password cannot be blank')
  }
  // Confirm Password validations - blank
  if(req.body.confirm === ''){
    array.push('Please confirm password')
  } else {
    paletteCollection.insert({
      email: req.body.email,
      password: req.body.password
    });
    res.redirect('/home/');
  }
});

module.exports = router;
