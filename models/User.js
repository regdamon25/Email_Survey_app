const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    //Whenever you define a Schema, you can just assign the type of field it is, or also can specify some other type of configuration you'll assign an object and pass a couple of different options into the object
    googleId: String,
    credits: { type: Number, default: 0 }
});

mongoose.model('users', userSchema);