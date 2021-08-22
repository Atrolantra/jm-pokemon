var express = require('express');
var router = express.Router();
var dataModel = require('../models/data-model.js');



// TODO statuses and stuff
router.get('/', function(req, res) {
    res.render('pages/index')
});

router.get('/index.ejs', function(req, res) {
    res.render('pages/index');
});

// Send all counts of uses in the db to the front end.
router.get('/uses', function(req, res) {
    cb_uses = function (rows) {
        res.send({all_rows: rows});
    };
    dataModel.getAllRows("pokemon", cb_uses);
});

// Posted to by front end when clicking to add pokemon to party.
// Add row if not there and increment uses count in row.
router.post('/index.ejs', function(req, res) {
    dataModel.createRow(req.query.pokemon_id);
    dataModel.incrementRow(req.query.pokemon_id)
    res.sendStatus(201);
});

module.exports = router;