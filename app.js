var express = require('express');
var load = require('express-load');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var routes = require('./routes/index');
var debug = require('debug')('express-example');
var models = require("./models");
var app = express();

var config = require('./config/config.json');

var cookie = cookieParser(config.session.SECRET);
var server = require('http').createServer(app);
var store = new expressSession.MemoryStore();

app.use(logger('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*Session*/
app.use(expressSession({
  secret: config.session.SECRET, 
  name: config.session.KEY, 
  resave: true, 
  saveUninitialized: true,
  store: store
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


/*Start no Servidor*/
app.set('port', process.env.PORT || 8080);


models.sequelize.sync().success(function (){
  var server = app.listen(app.get('port'), function(){
    
    /*Socket.io and Sessions*/
    var io = require('socket.io').listen(server);

    io.use(function(socket, next) {
      var data = socket.request;
      cookie(data, {}, function(err) {
        var sessionID = data.signedCookies[config.session.KEY];
        store.get(sessionID, function(err, session) {
          if (err || !session) {
            return next(new Error('Acesso negado!'));
          } else {
            socket.handshake.session = session;
            return next();
          }
        });
      });
    });

    load('controllers').into(io);

    /*Socket.io and Sessions*/

    debug('Express server listening on port ' + server.address().port);
  });
});


module.exports = app;
