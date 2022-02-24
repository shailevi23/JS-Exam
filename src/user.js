const StatusCodes = require('http-status-codes').StatusCodes;
const db = require('../database.js');

function User(email, user_id, display_name) {
	this.email = email;
	this.user_id = user_id;
	this.display_name = display_name;
}

const g_users = [];
const users_file = './files/users.json';

db.read_data(g_users, users_file).then(
	() => { console.log('Done reading users') }
).catch(reason => console.log('Failure:' + reason))

function create_user(email, id, name){
	const new_user = new User(email, id, name);

	g_users.push(new_user);
	db.write_file(g_users, users_file);
	return new_user;
}

module.exports = {users_file, g_users, create_user };
