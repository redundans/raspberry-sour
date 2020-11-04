var express = require('express');
var router = express.Router();
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var fs = require('fs');

/* GET logs listing. */
router.get('/', function(req, res, next) {
	var adapter = new FileSync('db.json');
	var db = low(adapter);
	var response = db.get('logs').sortBy('datetime').value().reverse();
	res.json(response);
});

module.exports = router;
