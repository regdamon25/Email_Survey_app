const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');


mongoose.connect(keys.mongoURI);

const app = express();
//Middle-Wares start...
app.use(bodyParser.json());

app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());
//Middle-Wares end...

require ('./routes/authRoutes')(app);
require ('./routes/billingRoutes')(app);

//This code is only to be ran when it's inside of production i.e inside of Heroku:
if (process.env.NODE_ENV === 'production') {
    /*this line makes sure that EXPRESS will serve up production assets
    like our main.js file, or main.css file!*/
    app.use(express.static('client/build'));

    /*Here EXPRESS will serve up the index.html file
    If it doesn't recognize the route.*/
    const path = require('path');
    app.get('*', (res, req) => {
       res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')); 
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);




