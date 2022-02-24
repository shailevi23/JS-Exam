class ReviewItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'ReviewItem', 'data-id': this.props.review.creator_id },
			React.createElement(
				'span',
				null,
				this.props.review.review,
				'. ',
				React.createElement('br', null),
				' Stars: ',
				this.props.review.star_rank,
				React.createElement('br', null),
				React.createElement('br', null)
			)
		);
	}
}

// class ShowMovie extends React.Component {
// 	constructor(props) {
// 		super(props);
// 	}

// 	render() {
// 		return <div className='ShowMovie' data-id={this.props.movie.movie_id}>
// 			<span>{this.props.movie.name}. <br />
// 			<img src={this.props.movie.image_url} alt="" width="32" height="32"></img>
// 			<br /><br /></span>
// 		</div>
// 	}
// }

class ReviewList extends React.Component {
	constructor(props) {
		super(props);
		this.handle_click = this.handle_click.bind(this);
		this.state = { reviews: [], movie: {} };
	}

	async componentDidMount() {
		this.update_list();
	}

	async fetch_reviews(id) {
		const response = await fetch('/api/reviews/' + id);
		const data = await response.json();
		return data;
	}

	async fetch_movie(id) {
		const response = await fetch('/api/movie/' + id);
		const data = await response.json();
		return data;
	}

	async update_list() {
		let url = window.location.href;
		let id = url.substring(url.length - 1);
		const reviews = await this.fetch_reviews(id);
		const current_movie = await this.fetch_movie(id);
		this.setState({ reviews: reviews.reviews_arr, movie: current_movie.curr_movie });
	}

	async handle_click() {
		const name = document.getElementById('name').value;
		const email = document.getElementById('email').value;
		const movie = document.getElementById('movie').value;
		const review = document.getElementById('review').value;
		const stars = document.getElementById('stars').value;

		const response = await fetch('/api/send_review', {
			method: 'POST',
			body: JSON.stringify({ name: name,
				email: email,
				movie: movie,
				review: review,
				stars: stars }),
			headers: { 'Content-Type': 'application/json' }
		});
		if (response.status == 200) {
			alert("Your review has been sent !");
			this.update_list();
		} else {
			const err = await response.text();
			alert(err);
		}
	}

	render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				null,
				React.createElement(
					'h5',
					null,
					'Movie Name: ',
					this.state.movie.name
				),
				React.createElement('img', { src: this.state.movie.image_url, width: '250px', height: '250px' })
			),
			'Write a new review:',
			React.createElement(
				'div',
				null,
				React.createElement('input', { type: 'name', id: 'name', placeholder: 'Your Name' }),
				React.createElement('br', null),
				React.createElement('input', { type: 'email', id: 'email', placeholder: 'Email', required: true }),
				React.createElement('br', null),
				React.createElement('input', { type: 'name', id: 'movie', placeholder: 'Movie Name', required: true }),
				React.createElement('br', null),
				React.createElement('input', { type: 'text', id: 'review', placeholder: 'Review', required: true }),
				React.createElement('br', null),
				React.createElement('input', { type: 'text', id: 'stars', placeholder: 'Stars' }),
				React.createElement('br', null),
				React.createElement(
					'button',
					{ onClick: this.handle_click },
					'Send'
				)
			),
			React.createElement(
				'div',
				null,
				this.state.reviews.map((item, index) => {
					return React.createElement(ReviewItem, {
						review: item, key: index });
				}),
				React.createElement(
					'span',
					{ style: { display: this.state.reviews.length ? 'none' : 'block' } },
					'This movie has no reviews!'
				)
			)
		);
	}
}

class MovieReviews extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				null,
				React.createElement(ReviewList, null)
			)
		);
	}
}