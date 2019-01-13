const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');


const User = mongoose.model('users');//we are pulling the model out of mongoose here

//takes user and generates a unique id for passport to stuff into a cookie
passport.serializeUser((user, done) => {
    //the below user.id is not the google profile ID
    //using the mango id helps when users signs in with different ids.
    //ie. facebook or google, or github

    //this line stuffs the user.id into the cookie
    done(null, user.id);
});
//takes in a user id into a mongoose model instance
//we search over database and when we find the user, we call done
passport.deserializeUser((id, done) => {
    //we capitalize User because it is a model class
    //We pass in the id and it finds that user
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true

        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
                //We already have a record with the given profile ID
                return done(null, existingUser);
            }

            //we don't have a user record with this ID, make a new record!
            const user = await new User({ googleId: profile.id }).save();
            done(null, user);
        }
    )
);