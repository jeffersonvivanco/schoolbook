var express = require('express');
var router = express.Router();
var passport = require('passport');

var mongoose = require('mongoose');
var Student = mongoose.model('Student');
var Reminder = mongoose.model('Reminder');
var Document = mongoose.model('Document');
var Notebook = mongoose.model('Notebook');
var moment = require('moment');

/* GET home page. */
router.get('/home', function(req, res, next) {
    if(req.user){

        res.render('home',{'date':moment().format('MMMM Do YYYY')});
    }
    else{
        console.log(req.user);
        res.redirect('/login');
    }
});
router.get('/', function (req, res, next) {
    res.redirect('/home');
});

/* Adding a reminder api */
router.post('/api/reminders/add',function (req, res) {
    var reminder = new Reminder({
       reminder: req.body.reminder,
        date: req.body.date
    });
    req.user.reminders.push(reminder);

    req.user.save(function (err, updated_user, count) {
        res.json({id:reminder.id});
    });

});
/* Getting reminders api */
router.get('/api/reminders', function (req, res) {

   res.json(req.user.reminders);
});
/* Deleting reminders api */
router.post('/api/delete-reminders', function (req, res) {

    for(var i=0; i<req.body.length; i++){
        req.user.reminders.id(req.body[i]).remove();
    }
    req.user.save(function (err,user, count) {

        res.json(user.reminders.map(function (rem) {
            return {
                'reminder':rem.reminder,
                'date':rem.date
            }
        }));
    });
});

/* Adding a notebook api */
router.post('/api/notebooks/add', function (req, res) {
    console.log('IN BODY THERE IS:'+req.body.name);
    var notebook = new Notebook({
       user: req.user._id,
        name: req.body.name,
        year: parseInt(req.body.year)
    });
    notebook.save(function (err, savedBook, count) {
        console.log(err);
        req.user.notebooks.push(savedBook);
        req.user.save(function (err, user, count) {
            res.json(user.notebooks.map(function (note) {
                return {
                    'name':savedBook.name,
                    'year':savedBook.year
                }
            }));
        })
    });
});
/* Saving a document api */
router.post('/api/save-doc/', function (req, res) {
    console.log(req.body);
    var notebook2 = req.body.notebookname;
    var document2 = req.body.documentname;

    console.log(notebook2,document2);
   Notebook.findOne({ user: req.user.id, name:notebook2 }, function (err, notebook, count) {
       if(err){
           console.log(err);
       }
       var document = new Document({
            data:req.body,
            notebookname: notebook2,
            documentname : document2
       });
       var alreadyExists = false;
       notebook.documents.forEach(function (document3) {
           if(document3.documentname === document.documentname){
               alreadyExists = true;
           }
       });
       if(alreadyExists){
           notebook.documents.forEach(function (document3) {
               if(document3.documentname === document.documentname){
                   document3.data = document.data;
                   alreadyExists = false;
               }
           });
       }else{
           notebook.documents.push(document);
           }

       notebook.save(function (err, savedNote, count) {
           res.json({"notebook":notebook2,"document":document2});
       });

   })

});
/* Getting documents api */
router.post('/api/documents', function (req, res) {
    Notebook.findOne({user:req.user.id, name: req.body.notebook}, function (err, notebook, count) {
        res.json(notebook.documents.map(function (document) {
            return {
                'data' : document.data,
                'notebookname':document.notebookname,
                'documentname':document.documentname
            }
        }));
    });

});


/* Getting all notebooks api */
router.get('/api/notebooks', function (req, res) {


   Notebook.find({ user: req.user.id}, function (err, notebooks, count) {
        if(err){
            console.log(err);
        }
       res.json(notebooks.map(function (note) {
           return {
               'name' : note.name,
               'year' : note.year
           }
       }));
       
   })
});


//-------AUTHENTICATION-------//
router.get('/login', function (req, res) {
   res.render('login');
});
router.post('/login', function (req, res, next) {
    // NOTE: use the custom version of authenticate so that we can
    // react to the authentication result... and so that we can
    // propagate an error back to the frontend without using flash
    // messages
    passport.authenticate('local', function (err, user) {
        if(user){
            // NOTE: using this version of authenticate requires us to
            // call login manually
            req.logIn(user, function (err) {
                res.redirect('/');
            });
        }else{
            res.render('login',{message:'Your login or password is incorrect.'} );
        }
    })(req, res, next);
    // NOTE: notice that this form of authenticate returns a function that
    // we call immediately! See custom callback section of docs:
    // http://passportjs.org/guide/authenticate/
});
router.get('/register', function (req, res) {
    res.render('register');
});
router.post('/register', function (req, res) {
    Student.register(new Student({username:req.body.username,firstname:req.body.firstname, lastname:req.body.lastname,age:req.body.age}),req.body.password, function (err, user) {
        if(err){
            // NOTE: error? send message back to registration...
            console.log(err);
            res.render('register',{message:'Your registration information is not valid'});
        } else{
            // NOTE: once you've registered, you should be logged in automatically
            // ...so call authenticate if there's no error
            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        }

    });
});
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});
//----------END--------------//
module.exports = router;
