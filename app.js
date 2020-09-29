/**
 * Load .env file.
 */
require('custom-env').env()

/**
 * Module dependencies.
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var moment = require('moment'); 
var fs = require('fs');

/**
 * Setup Serial Port.
 */
if ( process.env.SERIAL_PORT !=== "" ) {
var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var port = new SerialPort(process.env.SERIAL_PORT, {
    baudRate: 9600
});
var parser = port.pipe(new Readline({ delimiter: '\r\n' }));

/**
 * Read the serialPort data from Arduino.
 */
parser.on('data', (data) => {
	app.locals = {
	    temp: data,
	};
	// Read logs file
	fs.readFile('static/logs.json', 'utf-8', (err, data) => {
	    if (err) {
	        res.json( {"error": "No log file found."} );
	    }
	    // Parse JSON object
	    const logs = JSON.parse(data.toString());
	    // Add temp as entry i logs
		logs.push({ datetime: moment().format(), temp: app.locals.temp } )
		// Write logs to file§
		try {
		    fs.writeFileSync('static/logs.json', JSON.stringify(logs));
		} catch (error) {
		    console.error(error);
		}
	});
});
}

/**
 * Setup Routes.
 */
var indexRouter = require('./routes/index');
var logsRouter = require('./routes/logs');
var stampsRouter = require('./routes/stamps');
var tempRouter = require('./routes/temp');
var brewfatherRouter = require('./routes/brewfather');

/**
 * Start ExpressJS.
 */
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/static', express.static('./static'));
app.use('/logs', logsRouter);
app.use('/stamps', stampsRouter);
app.use('/temp', tempRouter);
app.use('/brewfather', brewfatherRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;