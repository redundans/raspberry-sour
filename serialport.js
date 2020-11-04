/**
 * Load .env file.
 */
require('custom-env').env()

var SerialPort = require('serialport');
var Readline = require('@serialport/parser-readline');
var moment = require('moment');
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');

/**
 * Setup database.
 */
var adapter = new FileSync('db.json');
var db = low(adapter);

/**
 * Set some defaults (required if your JSON file is empty).
 */
db.defaults({ recipes: [], logs: [] }).write();

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
        // Set default setTemp higher than room temperature.
        let setTemp = 99;

        // Get last log entry and the moment one hour after that.
        db.read();

        // Get active recipe
        let recipe = db.get('recipes').filter( item => {
            return item.activated !== false
        }).value().shift();

        // Get and Loop through recipe steps in reverse.
        let steps = recipe.steps.reverse();
        steps.forEach( step => {
            // If step are not after this moment + step time set setTemp.
            let stepdate = moment(recipe.activated).add(step.stepTime, 'days');
            if(moment().isBefore(stepdate) ) {
                setTemp = step.stepTemp;
            }
        });

        // Send setTime to SerialPost.
        port.write(setTemp+'\r\n')

        let lastLog = db.get('logs').takeRight(1).value().pop();
        let nextMoment = typeof lastLog !== "undefined" ? moment(lastLog.datetime).add(15, 'minutes') : moment().subtract(15, 'minutes');

        // If one hour passed since last log entry.
        if(moment().isAfter(nextMoment, 'minute') ) {
                // Write new log entry.
                db.get('logs').push({ datetime: moment().format(), temp: data }).write();
        }
    });
}

