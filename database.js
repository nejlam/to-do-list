const mysql = require('mysql2');

/*const dbConnection = mysql
	.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'todo_list'
	})
	.promise();
*/

const dbConnection = mysql
	.createPool({
		host: 'eu-cdbr-west-03.cleardb.net',
		user: 'b680eced3b8410',
		password: '1c5d0a48',
		database: 'heroku_c716d639849d18e'
	})
	.promise();

module.exports = dbConnection;
