var express = require('express');
var router = express.Router();

const values = ["Hari","Shimin","Rithik","Sidharth"]

router.get('/', function(req, res, next) {
  res.render('array', { values });
});

module.exports = router;
