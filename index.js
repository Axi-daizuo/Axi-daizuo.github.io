const mysql = require('mysql');

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'chaizhongxi1234',
  database: 'my_ax_01',
});

module.exports = db