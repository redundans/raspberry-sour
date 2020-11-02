var express = require('express');
var router = express.Router();
var moment = require('moment');
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var fs = require('fs');

/* GET recipes listing. */
router.get('/', function(req, res, next) {
	var adapter = new FileSync('db.json');
	var db = low(adapter);
	var response = db.get('recipes').value();
	res.json(response);
});

/* Set activated recipe. */
router.post('/', function(req, res, next) {
	var adapter = new FileSync('db.json');
	var db = low(adapter);
    var id = req.body._id;
    const idExists = db.get('recipes').find({ id: id }).value();
    if(idExists){
        db.get('recipes').each( (recipe) => {recipe.activated = false}).write();
        db.get('recipes').find({ id: id }).assign({ activated: moment().format() }).write();
    }
	var response = db.get('recipes').value();
	res.json(response);
});

module.exports = router;
