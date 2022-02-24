const db = require("../database.js");
const StatusCodes = require('http-status-codes').StatusCodes;
const user = require('./user.js');
const movies = require('./movies.js');
const g_reviews = [];
const reviews_file = './files/reviews.json';

function Review(creator_id, movie_id, review, star_rank) {
    this.creator_id = creator_id;
	this.movie_id = movie_id;
    this.review = review;
	this.star_rank = star_rank;
}

db.read_data(g_reviews, reviews_file).then(
	() => { console.log('Done reading users') }
).catch(reason => console.log('Failure:' + reason))

function send_review(req, res) {
    const creator_name = req.body.name;
    const creator_email = req.body.email;
    const movie_name = req.body.movie;
    let review_text = req.body.review;
    const rank_by_star = req.body.stars;
    let new_creator_id = "";

    if (!creator_email) {
		res.status(StatusCodes.BAD_REQUEST);
		res.send("Missing email, cant post new review");
		return;
	}
	if (!review_text) {
		res.status(StatusCodes.BAD_REQUEST);
		res.send("Missing review text in request, cant post new review")
		return;
	}
    if (!movie_name) {
        res.status(StatusCodes.BAD_REQUEST);
        res.send("Missing movie name in request, cant post new review");
        return;
    }
    if(rank_by_star < 1 || rank_by_star > 5)
    {
        res.status(StatusCodes.BAD_REQUEST);
        res.send("Exceeded star rank 1-5, cant post new review");
        return;
    }
	const check_movie =  movies.g_movies.find(movie => movie.name == movie_name);
    if (!check_movie) {
        res.status(StatusCodes.BAD_REQUEST);
        res.send("There is no such movie in the system, cant post new review");
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

    if (review_text.length > 1000) {
        review_text = review_text.substring(0, 1000);
    }

	const new_review = new Review(new_creator_id, check_movie.movie_id, review_text, rank_by_star);
	g_reviews.push(new_review);
	db.write_file(g_reviews, reviews_file);

	res.send(JSON.stringify(new_review));
}

function get_reviews(req, res) {
	const reviews = g_reviews;
	res.send(JSON.stringify(reviews));
}

function movie_reviews(req, res) {
	const id = parseInt(req.params.id);
    const reviews_arr = g_reviews.filter(review => review.movie_id == id);

	res.send(JSON.stringify({ reviews_arr }));
}

module.exports = { reviews_file, g_reviews, send_review, get_reviews, movie_reviews };