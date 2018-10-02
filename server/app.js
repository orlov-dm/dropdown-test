const express = require('express');
const path = require('path');
const Core = require('./Core');

const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const LOAD_PACK_SIZE = 1000;

app.get('/', function (req, res) {  
  loadUsers(0, LOAD_PACK_SIZE).then(data => {
    res.render('index', {
      data
    });
  });  
});
app.get('/users', function (req, res) {
  res.setHeader('Content-Type', 'application/json');  
  const {
    startIndex = null,
    packCount = LOAD_PACK_SIZE
  } = req.query;
  if(startIndex == null) {
    res.send('Start index is not set');
    return;
  }
  loadUsers(Number(startIndex), Number(packCount)).then(data => {
    res.send(data);
  });
});

async function loadUsers(startIndex, count) {
  console.log('LOAD USERS START ', startIndex, count);
  const data = await Core.getData({startIndex, count});
  console.log('LOAD USERS ', data.length);
  return Core.parseClientData(data);
}

const distPath = path.join(__dirname, '/../dist');
app.use(express.static(distPath));


const port = process.env.PORT || 8888;
app.listen(port, () => {
  console.log(`node.js static server listening on port: ${port}`);
});

// Properly kill nodemon
process.on('SIGINT', () => { console.log(' Stopping...'); process.exit(); });