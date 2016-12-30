/**
 * Created by jeffersonvivanco on 11/16/16.
 */
var  mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');



//my schema goes here
var Reminder = new mongoose.Schema({
    reminder: String,
    date: String
});
var Student = new mongoose.Schema({
    firstname :  String,
    lastname: String,
    age: Number,
    reminders: [Reminder],
    notebooks: [{type:mongoose.Schema.Types.ObjectId, ref:'Notebook'}]
});
var Document = new mongoose.Schema({
    data: Object,
    notebookname: String,
    documentname: String
});
var Notebook = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, ref:'Student'},
    name: String,
    year: Number,
    documents : [Document]
});


Student.plugin(passportLocalMongoose);
mongoose.model('Reminder',Reminder);
mongoose.model('Student',Student);
mongoose.model('Document',Document);
mongoose.model('Notebook',Notebook);

var fs = require('fs');
var path = require('path');
var fn = path.join(__dirname, 'config.json');
var data = fs.readFileSync(fn);

// our configuration file will be in json, so parse it and set the
// connection string appropriately!
var conf = JSON.parse(data);
var dbconf = conf.dbconf;

mongoose.connect(dbconf);