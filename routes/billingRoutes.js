const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
    /*Right here with "requireLogin" even though it IS a function we are not goin to invoke quite yet, instead
      we are telling Express 'Hey Express anytime someone makes a "post" request
      here is a REFERENCE to a function, to run, whenever a request comes into the application*/
    app.post('/api/stripe', requireLogin, async (req, res) => {
        /*The "requireLogin() (EVEN THOUGH NOT INVOKED YET)" will handle any situation that occurs 
        when someone tries to access somewhere where only a logged in user can go!!*/  
        const charge = await stripe.charges.create({
            amount: 500,
            currency: 'usd',
            description: '$5 for 5 credits',
            source: req.body.id
        });
        //req.user gets assigned by passport
        req.user.credits += 5;
        //have to call this function to save the users information, wont save on its own!!
        const user = await req.user.save();

        res.send(user);
    });
};