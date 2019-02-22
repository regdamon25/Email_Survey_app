//MIDDLE-WARE is a function that takes the incoming request has the abilty to modify it inside the middleware body. 
//"next" is a function that we call once our middleware is complete.
module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ error: 'You must LOG-IN!' });
    }

    next();
};