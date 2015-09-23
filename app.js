var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stickhero');

// var userSchema = new mongoose.Schema({
//     name: String,
//     nickname: String,
//     password: String
// });
var User = mongoose.model('users', {
    name: String,
    nickname: String,
    password: String
});

// var scoreSchema = new mongoose.Schema({
//     playDate: {type: Date, dafault: Date.now},
//     score: Number
// });
var Score = mongoose.model('scores',{
    playDate: {type: Date, dafault: Date.now},
    score: Number
});

var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var url = require('url');
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({secret:'secretKey'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){
    fs.readFile('index.html', function(err, data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
});

app.get('/register', function(req,res){
    fs.readFile('register.html', function(err,data){
        res.writeHead(200, {'Content-Type':'text.html'});
        res.end(data);
    });
});

var sess;
app.get('/login', function(req, res){
    sess = req.session;

    if(sess.userId){
        res.send("you are already logged in");  
        res.redirect('/main');
    }
    else{
        fs.readFile('login.html', function(err,data){
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        });
    }
});

app.get('/main', function(req, res){
    sess = req.session;
    if(sess.userId){
        fs.readFile('stickHero.html', function(err,data){
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        });
    }else{
        res.send("you need to log in first");
    }
});
//////////////////////////////////////
app.get('/ranking', function(req,res){
    mongoose.model('scores').find(function(err, scores){
    // mongoose.model('scores').find({}, function(err, scores){
    //     if(err){
    //         return console.error(err);
    //     }else{
    //         res.render('ranking.ejs',{
    //             // player:scores.userid,
    //             score: scores.score
    //         });
    //     }
    // });
        res.send(scores);
    });
});

app.get('/logout',function(req,res){
    var sess = req.session;
    sess.destroy(function(err){
        if(err){
            console.log("errorFromLogout" + err);
        }
        else{
            res.redirect('/');
        }
    });
});

////posts////
app.post('/register', function(req, res){
    mongoose.model('users').create({
        'name': req.body.name,
        'nickname': req.body.userId,
        'password': req.body.password
    });
    res.redirect('/');
});

app.post('/login', function(req, res){
    console.log("login in", sess);
    // login시 입력받는 데이타
    sess = req.session;
    var userId = req.body.userId;
    var password = req.body.pswd;
    console.log("next", sess);
    //  mongodb에 있는 nickname의 값이랑 userId랑 비교, 같은 거면
    // nickname의 password랑 password랑 같은지 비교하고
    // redirect to /main
 mongoose.model('users').find({nickname: userId}, function(err, data){
        if (data[0].password === password){
            sess.userId = userId;
            res.redirect('/main');
        }else{
            console.log("wrong username or password");
        }
    });
});

app.listen('8777', function(req,res){
    console.log("stickhero server starting on 8777");
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

// var routes = require('./routes/index');
// var users = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


// module.exports = app;
