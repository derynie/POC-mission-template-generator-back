const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*app.use(function(req, res, next) {
   res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   res.header('Access-Control-Allow-Credentials', 'true');
   next();
});*/

app.use(cors());

const router = require('./api/routes/index');

app.use('/api', router);


app.listen(3001, function () {
   console.log('Example app listening on port 3001!')
});