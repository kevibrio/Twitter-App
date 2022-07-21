require('dotenv').config();

const app = require('./server');
require('./database');

app.listen(4999)

