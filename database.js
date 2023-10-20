const mysql = require('mysql');

const connection = createConnection({
  host: 'databases.000webhost.com',
  database: 'id20897774_camiones',
  user: 'id20897774_admin',
  password: 'Admin123$',
});

connection.connect();
