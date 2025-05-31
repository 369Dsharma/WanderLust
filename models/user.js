const mongoose = require('mongoose');
const schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new schema({
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    email: {
        type: String,
        required: true,
        unique: true
    },
    // password: {
    //     type: String,
    //     required: true
    // },
    // this will be added by passport-local-mongoose
    // this will add the username and password fields to the schema
});

userSchema.plugin(passportLocalMongoose);
// this will add the username and password fields to the schema
// this will also add the methods to the schema
// this will also add the passport-local-mongoose methods to the schema

module.exports = mongoose.model('User', userSchema);
// this will export the user model
// this will be used in the app.js file to create the user model