const StatusCodes = require('http-status-codes').StatusCodes;
const g_movies = [];
const user = require('./user.js');
const movies_file = './files/movies.json';
const db = require('../database.js');

function Movie(name, movie_id, image_url, creator_id, secret_data) {
	this.name = name;
	this.movie_id = movie_id;
	this.image_url = image_url;
	this.creator_id = creator_id;
	this.secret_data = secret_data;
}

db.read_data(g_movies, movies_file).then(
	() => { console.log('Done reading users') }
).catch(reason => console.log('Failure:' + reason));


function publish_movie(req, res) {
    const creator_name = req.body.name;
	const creator_email = req.body.email;
	const movie_name = req.body.movie_name;
    const image_url = req.body.image_url;
    let new_creator_id = "";

    if (!creator_email) {
		res.status(StatusCodes.BAD_REQUEST);
		res.send("Missing email, cant craete movie");
		return;
	}
	if (!movie_name) {
		res.status(StatusCodes.BAD_REQUEST);
		res.send("Missing text in movie name");
		return;
	}
    if (!image_url) {
		res.status(StatusCodes.BAD_REQUEST);
		res.send("Image url is mandatory, please try again");
		return;
	}
    const check_movie = g_movies.find(movie => movie.name == movie_name);
    if(check_movie){
        res.status(StatusCodes.BAD_REQUEST);
		res.send("Movie already exists in the system");
		return;
    }

    const current_user = user.g_users.find(user => user.email == creator_email);
    if (!current_user) {
		let max_id = 0;
		user.g_users.forEach( item => { if (item.user_id > max_id) { max_id = item.user_id; }});
		new_creator_id = max_id + 1;

        if(!creator_name) {
            user.create_user(creator_email, new_creator_id, creator_email);
        }
        else{
            user.create_user(creator_email, new_creator_id, creator_name);
        }
	}
    else
    {
        new_creator_id = current_user.user_id;
    }

	// Find max id 
	let max_id = 0;
	g_movies.forEach( item => { if (item.movie_id > max_id) { max_id = item.movie_id; }});
	const new_movie_id = max_id + 1;

	const new_movie = new Movie(movie_name, new_movie_id, image_url, new_creator_id, new_movie_id);
	g_movies.push(new_movie);
	db.write_file(g_movies, movies_file);
	res.send(JSON.stringify(new_movie));
}

function get_movies(req, res) {
	const movies = g_movies;
	res.send(JSON.stringify(movies));
	
}

function delete_movie(req, res) {
    const movie_name = req.body.movie;
	const secret_data = req.body.secret_data;

    const check_movie = g_movies.find(movie => movie.name == movie_name);
    if(check_movie.secret_data == secret_data){
        const idx = g_movies.findIndex(movie => movie.name == movie_name);
        g_movies.splice(idx, 1);
        db.write_file(g_movies, movies_file);
		res.send(JSON.stringify("You delete the movie successfuly !"));
    }

}

function search_movie(req, res) {
    const search_string = req.body.search;
    const movies= [];
	const lower_case_string = search_string.toLowerCase();
	let current_movie;
    for(let i=0; i < g_movies.length; i++){
		current_movie = g_movies[i].name.toLowerCase();
		if(current_movie.includes(lower_case_string)) {
			movies.push(g_movies[i]);
		}
	}
	res.send(JSON.stringify(movies));
}


function movie_profile(req, res) {
	const id = parseInt(req.params.id);

	const idx = g_movies.findIndex(movie => movie.movie_id == id);
	if (idx < 0) {
		res.status(StatusCodes.NOT_FOUND);
		res.send("No such movie")
		return;
	}
	
	const curr_movie = g_movies[idx];
	res.send(JSON.stringify({ curr_movie }));
}

module.exports = { movies_file, g_movies, publish_movie, get_movies, delete_movie, search_movie, movie_profile };