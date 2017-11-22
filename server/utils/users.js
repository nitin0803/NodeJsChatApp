
class Persons {

	constructor () {
		this.users = [];
	}

	addUser (id, name, room) {
		var user = { id, name, room
			// this.id = id,
			// this.name = name,
			// this.age = age
		}
		console.log ('Adding new user  into users list' , user);
		this.users.push (user);
		return user;
	}

	removeUser (id) {
		var user = this.getUser(id);

		if (user) {
			this.users = this.users.filter ( m => m.id != id);
			console.log ('New users list' , this.users);
		}

		return user;
	}

	getUser (id) {
		var user = this.users.filter ( m => m.id === id)[0]; 
		return user;
	}

	getUserList (room) {

		var users = this.users.filter (m=>m.room === room);
		var namesArray = users.map( m=>m.name);
		console.log ('Current  users list' , namesArray);
		return namesArray;
	}
}

module.exports = {Persons};