const express = require('express');
const path = require('path');

//const generateTestData = require('./test_data');

const distPath = path.join(__dirname, '/../dist');
const app = express();
//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.use(express.static(__dirname + '../public'));
//app.set('views', distPath);
app.get('/', function(req, res) {
    res.render('index', { data: JSON.stringify('The index page!')});
});
app.use(express.static(distPath));


const port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log(`node.js static server listening on port: ${port}`);
});

// Properly kill nodemon
process.on('SIGINT', () => { console.log(' Stopping...'); process.exit(); });