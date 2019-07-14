const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');

// user model to call methods on it
const User = require("../models/User");

router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => { 
    res.render("register");
});

// Logout
router.get('/logout', (req, res) => {
    // Passport mw available
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

// Register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // check req fields
  if (!name || !email || !password2 || !password) { 
    errors.push({
      msg: "Please fill in all fields"
    });
  }

  // check pw match
  if (password !== password2) {
    errors.push({ msg: "Passwords don't match " });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password to be at leas 6 chars" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
   
    // check if email exists
    User.findOne({
      email: email
    }).then(user => {
        console.log('1')
      if (user) {
        errors.push({ msg: "email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {  
            const newUser = new User({
              name,
              email,
              password
            });
            console.log(password);
            
            bcrypt.genSalt(10, (err, salt) => {
                // salt we just generated
                // takes callback fn. 
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => { 
                    req.flash('success_msg', 'You are now registered. Log in.')
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
              });
            });
          } 
    })
}
});

// Handle login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

module.exports = router;
