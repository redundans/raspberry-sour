var express = require('express');
var router = express.Router();
var moment = require('moment');
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var fs = require('fs');

/* POST recipe from brewFather. */
router.post('/', function(req, res, next) {
    var steps = req.body.recipe.fermentation.steps;
    var name = req.body.recipe.name;
    var id = req.body.recipe._id;
	var adapter = new FileSync('db.json');
    var db = low(adapter);

    const idExists = db.get('recipes').find({ id: id }).value();
    if(idExists){
        db.get('recipes').find({ id: id }).assign({ id: id, datetime: moment().format(), name: name, steps: steps, activated: false }).write();
    } else {
        db.get('recipes').push({ id: id, datetime: moment().format(), name: name, steps: steps, activated: false }).write();
    }
	res.json( { "error": false } );
});

module.exports = router;
