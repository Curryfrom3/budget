const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Show all transactions for the logged-in user
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
        res.render('pages/transactions', { transactions });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

// Show form to add a new transaction
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('pages/addTransaction');
});

// Handle new transaction submission
router.post('/add', ensureAuthenticated, async (req, res) => {
    const { type, amount, category, date, description } = req.body;
    if (!type || !amount || !category) {
        req.flash('error_msg', 'Please fill in all required fields.');
        return res.redirect('/transactions/add');
    }
    try {
        await Transaction.create({ 
            user: req.user.id, type, amount, category, date, description 
        });
        req.flash('success_msg', 'Transaction added successfully.');
        res.redirect('/transactions');
    } catch (err) {
        console.error(err);
        res.redirect('/transactions/add');
    }
});

// Show form to edit a transaction
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.user.toString() !== req.user.id) {
            req.flash('error_msg', 'Not authorized');
            return res.redirect('/transactions');
        }
        res.render('pages/editTransaction', { transaction });
    } catch (err) {
        console.error(err);
        res.redirect('/transactions');
    }
});

// Handle transaction update
router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.user.toString() !== req.user.id) {
            req.flash('error_msg', 'Not authorized');
            return res.redirect('/transactions');
        }

        Object.assign(transaction, req.body);
        await transaction.save();

        req.flash('success_msg', 'Transaction updated successfully.');
        res.redirect('/transactions');
    } catch (err) {
        console.error(err);
        res.redirect('/transactions');
    }
});

// Handle transaction deletion
router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.user.toString() !== req.user.id) {
            req.flash('error_msg', 'Not authorized');
            return res.redirect('/transactions');
        }

        await transaction.deleteOne();
        req.flash('success_msg', 'Transaction deleted successfully.');
        res.redirect('/transactions');
    } catch (err) {
        console.error(err);
        res.redirect('/transactions');
    }
});

module.exports = router;
