var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET logs listing. */
router.get('/', function(req, res, next) {
	fs.readFile('static/logs.json', 'utf-8', (err, data) => {
	    if (err) {
	        res.json( {"error": "No logs saved yet."} );
	    }

	    // parse JSON object
	    const logs = JSON.parse(data.toString());
		res.json( logs );
	});
});

/* PUT logs listing. */
router.put('/', function(req, res, next) {
	const data = JSON.stringify(req.body);
	try {
	    fs.writeFileSync('static/logs.json', data);
	    console.log("JSON data is saved.");
	} catch (error) {
	    console.error(err);
	    res.json( {"error": "Could not write logs."} );
	}
	res.json( { "error": false } );
});

module.exports = router;
