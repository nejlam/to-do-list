const mysql = require('mysql2');
const dbConnection = mysql
	.createPool({
		host: 'localhost',
		user: 'root',
		password: 'password',
		database: 'todo_list'
	})
	.promise();
module.exports = dbConnection;
