var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/colorPalettes');
var paletteCollection = db.get('palettes')
var bcrypt = require('bcryptjs');
var unirest = require('unirest')
var key = process.env.COLORTAG_API;

var imageUrlPalette = require('../public/javascripts/color.js')


/* GET Index page. */
router.get('/', function(req, res, next) {
  // API Documentation
  // These code snippets use an open-source library. http://unirest.io/nodejs
  unirest.get("https://apicloud-colortag.p.mashape.com/tag-url.json?palette=simple&sort=relevance&url=" + req.body.imageURL)
  .header("X-Mashape-Key", key)
  .header("Accept", "application/json")
  .end(function (result) {
    console.log(result.status, result.headers, result.body);
    // Find Palette Database
    paletteCollection.find({}, function(err, palettes){
      res.render('index', { title: '24 Palettes' , colors: result.body});
    });
  });
});

// ************ Grab the Home Page for Users once logged in ***************
router.get('/home', function(req,res,next){
  res.render('home');
});

// ***************** Grab Directory Page *********************************
router.get('/directory', function(req,res,next){
  res.render('directory');
})


// ##################### INDEX PAGE FUNCTIONS ! ##############################

// ************* Check Validations for Create Account **********************
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
    // password must not match username
  } else if (req.body.newPassword === req.body.newUsername){
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
    res.render('', { title: '24 Palettes', errors: array})
  } //ELSE
  else {
    // IF username already exists render errror
    paletteCollection.find({}, function(err, palettes){
      var errorArray = [];
      for(var i =0; i< palettes.length; i++){
        if(req.body.newUsername.toUpperCase() === palettes[i].username.toUpperCase()){
          errorArray.push('Username ID already exists');
          res.render('', {title: '24 Palettes', errors: errorArray})
        }
      }
      // if errorArray OR palettes length is 0, insert new user info into database
      if (errorArray.length === 0 || palettes.length === 0) {
        paletteCollection.insert({
          username: req.body.newUsername,
          password: bcrypt.hashSync(req.body.newPassword, 8)
        });
        res.cookie('currentUser' , req.body.newUsername);
        res.redirect('/home');
      }
   });

  }
});

// ********************* Validations for LOGIN Page **************************

router.post('/login', function(req, res, next){
  // Username cannot be blank
  var array = [];
  if (req.body.username === ''){
    array.push('Username cannot be blank')
  }
  // Password cannot be blank
  if (req.body.password === ''){
    array.push('Password cannot be blank')
  }
  // if errors, print them!
  if (array.length > 0){
    res.render('' , {title: '24 Palettes' , errors: array})
  } else {
    paletteCollection.findOne({username:req.body.username}, function(err,palettes){
      var array = [];
      // if username does not exist in database
      if (!palettes){
        array.push('Username does not exist')
        res.render('', {title: '24 Palettes' , errors:array})
        // check to see if password matches
      } else if(bcrypt.compareSync(req.body.password , palettes.password)){
        res.cookie('currentUser' , req.body.username);
        res.redirect('/home');
      } else {
        array.push('Invalid Password')
        res.render('' , {title: '24 Palettes' , errors:array})
      }
    })
  }
});

// ************************* INDEX URL API CALL **************************
router.post('/indexUploadURL', function(req, res, next) {
  unirest.get("https://apicloud-colortag.p.mashape.com/tag-url.json?palette=simple&sort=relevance&url=" + req.body.indexImageURL)
  .header("X-Mashape-Key", key)
  .header("Accept", "application/json")
  .end(function (result) {
    console.log(result.status, result.headers, result.body);
    var indexImageURL = req.body.indexImageURL
    var palette = imageUrlPalette.hexValues(indexImageURL, result.body.tags)
    // Find Palette Database
    paletteCollection.find({}, function(err, palettes){
      res.render('index', {title: '24 Palettes' , colors: palette, image: req.body.indexImageURL });
    });
  });
});

// ********************* HOME PAGE API CALL ************************
// router.post('/directory' , function(req,res,next){
//   console.log(req.body);
//   unirest.post("https://apicloud-colortag.p.mashape.com/tag-file.json")
//   .header("X-Mashape-Key", key)
//   .attach("image", fs.createReadStream(req.body.upload))
//   .field("palette", "simple")
//   .field("sort", "relevance")
//   .end(function (result) {
//   console.log(result.status, result.headers, result.body);
//     res.redirect('/home');
//   });
// });

// ************************* Directory URL API CALL **************************
router.post('/uploadURL', function(req, res, next) {
    console.log(req.body.imageURL);
  unirest.get("https://apicloud-colortag.p.mashape.com/tag-url.json?palette=simple&sort=relevance&url=" + req.body.imageURL)
  .header("X-Mashape-Key", key)
  .header("Accept", "application/json")
  .end(function (result) {
    console.log(result.status, result.headers, result.body);
    // Find Palette Database
    paletteCollection.find({}, function(err, palettes){
      res.render('directory', {colors: result.body});
    });
  });
});


module.exports = router;
