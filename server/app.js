const express = require('express');
const path = require('path');
const data = require('./data');

const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/', function(req, res) {
    res.render('index', { data: JSON.stringify('The index page!')});
});
const distPath = path.join(__dirname, '/../dist');
app.use(express.static(distPath));


const port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log(`node.js static server listening on port: ${port}`);
});

// Properly kill nodemon
process.on('SIGINT', () => { console.log(' Stopping...'); process.exit(); });