var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var cors = require('cors')
    , mongoose = require('mongoose')
    , dataservice = require('./modules/playerService');
var url = require('url');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
mongoose.connect('mongodb://localhost:27017/players');
var playerSchema = new mongoose.Schema({
    meta: {
        name: String,
        marketValue: String
    },
    details: {
        name: String,
        position: String,
        dateOfBirth: String,
        nationality: String,
        marketValue: String
    },
    status: {
        weight: String,
        height: String,
        defence: String,
        attack: String,
        speed: String,
        shoot: String,
        header: String,
        balance: String
    },
    history: [
        {
            clubName: String,
            minute: String,
            goal: String,
            red: String,
            yellow: String,
            rating: String
        }
    ]
});
var Player = mongoose.model('Player', playerSchema);
app.post('/players', cors(), function (request, response) {
    dataservice.create(Player, request.body, response);
});
app.get('/players/meta',cors(), function (request, response) {
    dataservice.meta(Player, response);
});
app.get('/players/detail/:id',cors(), function (request, response) {
    dataservice.detail(Player, response,request.params.id);
});
app.get('/players/form',cors(), function (request, response) {
    dataservice.init(Player, response);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
