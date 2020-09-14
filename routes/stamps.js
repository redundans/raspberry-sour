var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET stamps listing. */
router.get('/', function(req, res, next) {
	fs.readFile('static/stamps.json', 'utf-8', (err, data) => {
	    if (err) {
	        res.json( {"error": "No stamps saved yet."} );
	    } else {
		    // parse JSON object
		    const stamps = JSON.parse(data.toString());
			res.json( stamps );
		}
	});
});

/* PUT stamps listing. */
router.put('/', function(req, res, next) {
	const data = JSON.stringify(req.body);
	try {
	    fs.writeFileSync('static/stamps.json', data);
	    console.log("JSON data is saved.");
	} catch (error) {
	    console.error(err);
	    res.json( {"error": "Could not write stamps."} );
	}
	res.json( { "error": false } );
});

module.exports = router;
