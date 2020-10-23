var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var moment = require('moment'); 
var low = require('lowdb');

/**
 * Setup database.
 */
var adapter = new FileSync('db.json');
var db = low(adapter);

/**
 * Set some defaults (required if your JSON file is empty).
 */
db.defaults({ recipes: [], logs: {} }).write();

/**
 * Setup Serial Port.
 */
if ( process.env.SERIAL_PORT !== "" ) {
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
		// Get last log entry and the moment one hour after that.
		let lastLog = db.get('logs').takeRight(1).value();
		let nextMoment = moment(lastLog.datetime).add(1, 'hours');

		// I one hour passed since last log entry.
		if(moment().isAfter(nextMoment, hour) ) {
			// Write new log entry.
			db.get('logs').push({ datetime: moment().format(), temp: app.locals.temp }).write();
		}
	});
}