const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model for MongoDB

// Route for viewing user profile (only logged-in users should have access)
router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('profile', { user: req.user }); // Render profile page with user data
    } else {
        res.redirect('/login'); // Redirect to login page if not authenticated
    }
});

// Route for rendering the registration form
router.get('/register', (req, res) => {
    res.render('register'); // Render the register page
});

// Route for handling user registration (POST request)
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate inputs and create a new user
    const newUser = new User({ username, password });
    newUser.save()
        .then(() => {
            res.redirect('/login'); // Redirect to login after successful registration
        })
        .catch((err) => {
            res.status(500).send('Error creating user: ' + err);
        });
});

// Route for rendering the login form
router.get('/login', (req, res) => {
    res.render('login'); // Render the login page
});

// Route for handling login (POST request)
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Route for handling user logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login'); // Redirect to login page after logout
    });
});

module.exports = router;
