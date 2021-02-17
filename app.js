var createError = require('http-errors'); // 处理错误
var express = require('express');
var path = require('path'); // 路径
var cookieParser = require('cookie-parser'); // cookie
var logger = require('morgan'); // 日志
var sassMiddleware = require('node-sass-middleware'); // sass 中间件

var indexRouter = require('./routes/index'); // index 路由
var usersRouter = require('./routes/users'); // users 路由
var baseRouter = require('./routes/base') // base 路由

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views')); // 设置视图根目录
app.set('view engine', 'pug'); // 使用 pug 模板

// 声明使用中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.all('/*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

// 声明路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/base', baseRouter);

// catch 404 and forward to error handler 自定义404中间件
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler 自定义错误抛出中间件
app.use(function(err, req, res, next) { 
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var debug = require('debug')('my-application'); // debug模块
app.set('port', process.env.PORT || 3000); // 设定监听端口
 
//启动监听
var server = app.listen(app.get('port'), function() {
debug('Express server listening on port ' + server.address().port);
});

module.exports = app;
