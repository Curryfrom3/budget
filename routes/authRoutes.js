const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// Register Page
router.get('/register', (req, res) => res.render('pages/register'));

// Register User
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match');
        return res.redirect('/auth/register');
    }
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            req.flash('error_msg', 'Email already registered');
            return res.redirect('/auth/register');
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        req.flash('success_msg', 'Registration successful. Please log in.');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.redirect('/auth/register');
    }
});

// Login Page
router.get('/login', (req, res) => res.render('pages/login'));

// Login Handler
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success_msg', 'Logged out successfully');
        res.redirect('/auth/login');
    });
});

module.exports = router;
