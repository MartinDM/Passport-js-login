module.exports = {
    ensureAuthenticated: function(req, res, next){
         // Checks for req.user
        if (req.isAuthenticated()) {
            console.log('ok')
            next();
        } else { 
            console.log('nope')
            req.flash('error_msg', 'Please log in!');
            res.redirect('/users/login')
        } 
    }
} 