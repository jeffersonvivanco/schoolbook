/**
 * Created by jeffersonvivanco on 11/27/16.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Student = mongoose.model('Student');

// NOTE: passport-local-mongoose gives back a function
// that does the authentication for us. The plugin adds
// a static authenticate method to our schema that
// returns a function... we can check out how it works
passport.use(new LocalStrategy(Student.authenticate()));

// NOTE: specify how we save and retrieve the user object
// from the session; rely on passport-local-mongoose's
// functions that are added to the user model
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());