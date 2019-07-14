const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User model
const User = require('../models/User');

module.exports = (passport) => {

    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // match user to email
            User.findOne({ email: email})
            .then( user => {

                if (!user) { 
                    // err, user, opts
                    return done( null, false, { message: 'Email is  Not registered'})
                }

                // Match pw to the one stored in db
                bcrypt.compare(password, user.password, ( err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, {message: 'Password incorrect :('})
                    }
                });

            })
            .catch(err =>  console.log(error))
        })
    );


    passport.serializeUser( (user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser( (id, done) => {
          User.findById( id, ( err, user) => {
              done(err, user)
          });
    });

} 