var mysql = require('mysql');
var config = require('../config/config.js');

var db = mysql.createPool(config.databaseOptions);
module.exports = db;