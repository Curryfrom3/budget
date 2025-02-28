// routes/budget.js
const express = require('express');
const router = express.Router();

// Example route to view the budget page
router.get('/', (req, res) => {
    res.render('budget'); // Assumes a 'budget.ejs' view exists
});

// Example route to add a budget entry (POST)
router.post('/add', (req, res) => {
    // Logic for adding a budget entry (e.g., saving to database)
    res.send('Budget entry added');
});

module.exports = router;
