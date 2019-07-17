const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import local users
const users = require('../mocks/users').users;

module.exports = (passport) => {

    passport.use(
        new LocalStrategy({ usernameField: 'email', passReqToCallBack: true }, (email, password, done) => {
            //console.log(users)
            // Match user to supplied email
            let user = users.find( user => user.email === email );
            // No user found
            if (typeof user === 'undefined') {
                // err, user, opts
                return done(null, false, { message: 'Email is not registered'})
            }
            console.log(user.password)
            console.log('supplied', password)

            // Now match password to the one stored in users array
            if ( password !== user.password ) {
                return done(null, false, { message: 'Password incorrect'})
            }

            // Success
            return done(null, user)
        })
    )

    passport.serializeUser( (user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser( (id, done) => {
        const user = users.find( user => user.id === id ) 
        done(null, { id: user.id, first_name: user.first_name} ) 
    });

} 