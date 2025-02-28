const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const passport = require('passport');
const flash = require('connect-flash');
const User = require('./models/User'); // Assuming you have a User model
const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session and Passport setup
app.use(session({
    secret: 'your_secret_key', // Change this to something more secure
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/your-db-name' }), // Change to your MongoDB URL
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Set up locals for flash messages and user
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
});

// Routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const budgetRoutes = require('./routes/budget'); // Ensure this file exists

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/budget', budgetRoutes); // Adds the /budget routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
