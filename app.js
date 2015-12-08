var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');// req.session
var MongoStore = require('connect-mongo')(session);//是用来将connect的session持久化到mongodb中的
var flash=require('connect-flash');//弹出提示


var routes = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');

var app = express();

require('./db');//导入db模块

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'chenshaomeiblog',//加密
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://10.1.20.97/chenshaomeiblog'
  }),
  cookie:{//cookie的最大效用时间
    maxAge:30*60*1000
  }
}))

app.use(flash());// req.flash 使用提示信息输出中间件
app.use(function(req,res,next){
  res.locals.keyword = '';
  res.locals.user=req.session.user;//赋值给全局变量 才能在模板直接取到值
  res.locals.success=req.flash('success').toString();//登录成功提示
  res.locals.error = req.flash('error').toString();//提示信息转字符串并且 赋值给全局变量 才能在模板直接取到值
  next();
})


app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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


module.exports = app;
