class MovieItem extends React.Component {
	constructor(props) {
		super(props);
		this.handle_click = this.handle_click.bind(this);
	}

	handle_click() {
		if (this.props.handle_movie_click) this.props.handle_movie_click(this.props.movie.movie_id);
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'MovieItem', 'data-id': this.props.movie.image_url },
			React.createElement(
				'button',
				{ onClick: this.handle_click },
				React.createElement(
					'span',
					{ id: 'name' },
					this.props.movie.name
				)
			)
		);
	}
}

class MovieList extends React.Component {
	constructor(props) {
		super(props);
		this.handle_search_click = this.handle_search_click.bind(this);
		this.handle_movie_click = this.handle_movie_click.bind(this);
		this.state = { movies: [], isNewPost: false };
	}

	async componentDidMount() {
		this.update_list();
	}

	async fetch_movies() {
		const response = await fetch('/api/get_movies');
		const data = await response.json();
		return data;
	}

	async update_list() {
		const movies_arr = await this.fetch_movies();
		const three_random_movies = [];
		three_random_movies.push(movies_arr[Math.floor(Math.random() * movies_arr.length)]);
		three_random_movies.push(movies_arr[Math.floor(Math.random() * movies_arr.length)]);
		three_random_movies.push(movies_arr[Math.floor(Math.random() * movies_arr.length)]);
		this.setState({ movies: three_random_movies });
	}

	async handle_search_click() {
		const search = document.getElementById('search').value;

		const response = await fetch('/api/search_movie', {
			method: 'POST',
			body: JSON.stringify({ search: search }),
			headers: { 'Content-Type': 'application/json' }
		});
		if (response.status == 200) {
			const data = await response.json();
			this.setState({ movies: data });
			document.getElementById('search').value = "";
		} else {
			const err = await response.text();
			alert(err);
		}
	}

	handle_movie_click(id) {
		window.location = `/pages/movies.html?id=${id}`;
	}

	render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				null,
				React.createElement('input', { type: 'text', id: 'search', placeholder: 'Search for a movie', required: true }),
				React.createElement('br', null),
				React.createElement(
					'button',
					{ onClick: this.handle_search_click },
					'Search'
				)
			),
			React.createElement('br', null),
			React.createElement(
				'div',
				{ id: 'movie' },
				this.state.movies.map((item, index) => {
					return React.createElement(MovieItem, {
						handle_movie_click: this.handle_movie_click, movie: item, key: index });
				})
			)
		);
	}
}

class Landing extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(
			'div',
			{ style: { display: 'inline-grid' } },
			'Add a new Movie !',
			React.createElement(ReactButton, { name: 'Add Movie', relocation: '/pages/addmovie.html' }),
			React.createElement('br', null),
			'Search a Movie !',
			React.createElement(
				'div',
				null,
				React.createElement(MovieList, null)
			)
		);
	}
}