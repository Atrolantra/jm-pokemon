const db = require('../database/db');

// Create a new row in the table with the pokemon_id set to id and uses set to 0.
function createRow(ID) {
    let sql = `INSERT INTO pokemon (pokemon_id, uses) SELECT ${ID}, 0 WHERE NOT EXISTS(SELECT ${ID} FROM pokemon WHERE pokemon_id = ${ID})`;
    db.query(sql);
}

// Given a pokemon's ID, increment the uses value by one.
function incrementRow(ID) {
    let sql = `UPDATE pokemon SET uses = uses + 1 WHERE pokemon_id = ${ID}`;
    db.query(sql);
}

// Return all of the rows in the table.
function getAllRows(table, cb) {
    let sql = `SELECT * FROM ${table}`;
    db.query(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        cb(rows);
    });
}

module.exports = {
    createRow,
    incrementRow,
    getAllRows
}