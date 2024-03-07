// app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const Controller = require('./controllers/controller');


function isLoggedIn(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

const app = express();
app.use(session({
    secret: "verysafelongsessionkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));
console.log(process.env.SESSION_SECRET);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => res.redirect('/login'));
// Serve login form
app.get('/login', Controller.getAllUsers, (req, res) => {
    res.render('login', { users: res.locals.data.users });
});

// Handle login
/* app.post('/login', authController.login); */

app.post('/login', Controller.login);

// Serve logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});


app.get('/home', isLoggedIn,  Controller.getAllConversationsForUser, (req, res) => {
    res.render('home', { user: req.session.user, conversations: res.locals.data.conversations, users: res.locals.data.users});
});
// Serve home
/* app.get('/home', isLoggedIn, portfolioController.getAllPortfolioItems, (req, res) => {
    res.render('home', { user: req.session.user, posts: res.locals.data.portfolioItems });
}); */

app.post('/conversation', isLoggedIn, Controller.getConversation, (req, res) => {
    res.render('conversation', { user: req.session.user, conversation: res.locals.data.conversation, messages: res.locals.data.messages, participants: res.locals.data.participants });
});


app.post('/createchat', isLoggedIn, Controller.createChat, (req, res) => {
    res.redirect('/home');
});

app.post('/sendmessage', isLoggedIn, Controller.sendMessage, (req, res) => {

});
app.get('/debug',Controller.debug)

module.exports = app;