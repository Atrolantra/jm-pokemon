// Load Node modules
const express = require('express');
const ejs = require('ejs');
// Initialise Express
const app = express();
var path = require('path')
app.use(express.static(path.join(__dirname, '/public')));
// Render static files
app.use(express.static('public'));
// Set the view engine to ejs
app.set('view engine', 'ejs');
// Port website will run on
app.listen(8080);

const pokemonListRouter = require('./routes/pokemon-list-routing');
app.use('/', pokemonListRouter);
app.use('/index', pokemonListRouter);

app.get('/party_page.ejs', function (req, res) {
    res.render('pages/party_page');
});

