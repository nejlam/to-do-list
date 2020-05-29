# To-do-list

an app that let's you register, login and then add your to-do tasks to your list. 
It is deployed on Heroku and available on the link - [To-Do List](https://to-do-list--heroku.herokuapp.com/)

## Build setup

To setup the database localy, your database.js file should look like this:
```
const mysql = require('mysql2');

const dbConnection = mysql
	.createPool({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'todo_list'
	})
	.promise();

module.exports = dbConnection;
```

In your mySQL cli insert:
```
CREATE DATABASE IF NOT EXISTS todo_list;

USE todo_list;

CREATE TABLE `users` (
 `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
 `name` varchar(50) NOT NULL,
 `email` varchar(50) NOT NULL,
 `password` varchar(255) NOT NULL,
 PRIMARY KEY (`id`),
 UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
To run the app localy:
```
//install dependencies
npm install 

//serve with hot reload at localhost:3000
npm run dev
```

## Notes
*Save lists to the database* functionality has yet to be added.

#### Acknowledgements
The to-do app only was made by the model from "The Web Developer Bootcamp" by Colt Steele.
The register/login system was made with a little help from a tutorial by @chandantudu 
