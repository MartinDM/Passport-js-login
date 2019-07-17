const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');

// user model to call methods on it
const User = require("../models/User");

router.get("/", (req, res) => res.render("login"));
 
// Logout
router.get('/logout', (req, res) => {
    // Passport mw available
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
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
