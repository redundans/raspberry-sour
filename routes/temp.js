var express = require('express');
var router = express.Router();

/* GET logs listing. */
router.get('/', function(req, res, next) {
  res.json( {"temp":req.app.locals.temp} );
});

module.exports = router;
