require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/database');
const indexRoutes = require('./routes/index');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 8080;
const app = express();

// Configure MongoDBStore
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions' // Name of the collection to store sessions
});

store.on('error', function (error) {
    console.error('MongoDBStore connection error:', error);
});

// Use cors middleware
app.use(
    cors({
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
        origin: '*'
    })
);

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure express-session middleware
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: store, // Use MongoDBStore as session store
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // Session expiration in milliseconds (e.g., 1 day)
            secure: process.env.NODE_ENV === 'production' ? true : false, // Secure cookie in production  //TODO === 'production'
            sameSite: 'strict' // Restrict cookie to same-site requests
        }
    })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure GitHub strategy for passport
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL
        },
        function (accessToken, refreshToken, profile, done) {
            console.log('GitHub strategy callback hit');
            console.log('Access token:', accessToken);
            console.log('Profile:', profile);
            return done(null, profile);
        }
    )
);

// Passport serialization
passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log('Deserializing user:', user);
    done(null, user);
});

// Routes
app.use('/', indexRoutes);

// OAuth endpoints
app.get('/', (req, res) => {
    console.log('Root endpoint hit');
    console.log('User session:', req.session.user);
    res.send(
        req.session.user !== undefined
            ? `Logged in as ${req.session.user.displayName}`
            : 'Logged Out'
    );
});

// GitHub callback
app.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/', session: true }),
    (req, res) => {
        console.log('GitHub callback endpoint hit');
        req.session.user = req.user; // Ensure req.user is correctly populated
        console.log('req.session.user:', req.session.user);
        console.log('req.session.user:', req.session.user);
        console.log(
            'req.session.user.id:',
            req.session.user ? req.session.user.id : 'undefined'
        );
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
            }
            res.redirect('/');
        });
    }
);

// Initialize DB and start server
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Connected to DB and listening on ${port}`);
        });
    }
});

//// Error handling middleware
//app.use((err, req, res, next) => {
//    console.error(err.stack);
//    res.status(500).send('Internal Server Error');
//});

// Error handler for 404
app.use((req, res, next) => {
    next(createError(404, 'Not Found'));
});

// General error handler
app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});
