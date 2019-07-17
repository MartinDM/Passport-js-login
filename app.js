const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const path = require('path');
const passport = require('passport');

//const db = require('./config/keys').MongoURI;

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({ extended: true }));

// Express session middleware
app.use(session({
    secret: 'secret!',
    resave: true,
    saveUninitialized: true
}))

// Passport config 
require('./config/passport')(passport);

// connect flash
app.use(flash())

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global vars middleware
app.use( ( req, res, next ) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error');
    next();
}); 

/* 
mongoose.connect( db, { useNewUrlParser: true })
    .then( ()=> console.log('MongoDB connected...'))
    .catch( err => console.log(err) ); */
    
// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server started on port ${PORT}`))