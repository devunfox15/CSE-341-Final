require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/database');
const indexRoutes = require('./routes/index');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Auth
app.use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'], origin: "*" }));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Github strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

// Passport serialization
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use('/', indexRoutes);

// OAuth endpoints
app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});

// GitHub callback
//app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/api-docs', session: false }),
app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/', session: false }),
    (req, res) => {
        req.session.user = req.user;
        console.log(req.user)
        console.log(req.session.user)
        console.log(req.session.user.displayName)
        res.redirect('/');
    }
);

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Connected to DB and listening on ${port}`);
        });
    }
});