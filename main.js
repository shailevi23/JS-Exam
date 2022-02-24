// External modules
const express = require('express')
const cookieParser = require('cookie-parser');
const path = require('path');
const StatusCodes = require('http-status-codes').StatusCodes;
const package = require('./package.json');
const movie = require('./src/movies.js');
const review = require('./src/reviews.js');


const app = express()
let  port = 5050;

const reExt = /\.([a-z]+)/i;

function content_type_from_extension( url)
{
	const m = url.match( reExt );
	if ( !m ) return 'application/json'
	const ext = m[1].toLowerCase();

	switch( ext )
	{
		case 'js': return 'text/javascript';
		case 'css': return 'text/css';
		case 'html': return 'text/html';
	}

	return 'text/plain'
}

// General app settings
const set_content_type = function (req, res, next) 
{
	const content_type = req.baseUrl == '/api' ? "application/json; charset=utf-8" : content_type_from_extension( req.url)
	res.setHeader("Content-Type", content_type);
	next()
}

app.use(  set_content_type );
app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded( // to support URL-encoded bodies
{  
  extended: true
}));

app.use(cookieParser());

// Routing
const router = express.Router();

router.get('/reviews/:id', (req, res) => { review.movie_reviews(req, res) });
router.get('/movie/:id', (req, res) => { movie.movie_profile(req, res) });
router.get('/get_movies', (req, res) => { movie.get_movies(req, res) });
router.get('/get_reviews', (req, res) => { review.get_reviews(req, res) });
router.post('/search_movie', (req, res) => { movie.search_movie(req, res) });
router.post('/send_review', (req, res) => { review.send_review(req, res) });
router.post('/publish_movie', (req, res) => { movie.publish_movie(req, res) });
router.delete('/delete_movie', (req, res) => { movie.delete_movie(req, res) })



app.use(express.static(path.join(__dirname, 'site')));

app.use('/api',router)

let msg = `${package.description} listening at port ${port}`
app.listen(port, () => { console.log( msg ) ; })



