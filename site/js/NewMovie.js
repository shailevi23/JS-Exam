class NewMovie extends React.Component {
				constructor(props) {
								super(props);
								this.handle_click = this.handle_click.bind(this);
				}

				async handle_click() {
								const name = document.getElementById('name').value;
								const email = document.getElementById('email').value;
								const movie = document.getElementById('movie_name').value;
								const image = document.getElementById('image_url').value;

								const response = await fetch('/api/publish_movie', {
												method: 'POST',
												body: JSON.stringify({ name: name,
																email: email,
																movie_name: movie,
																image_url: image }),
												headers: { 'Content-Type': 'application/json' }
								});
								if (response.status == 200) {
												alert("Your movie has been sent !");
												window.location.href = '/pages/landing.html';
								} else {
												const err = await response.text();
												alert(err);
								}
				}

				render() {
								return React.createElement(
												'div',
												null,
												React.createElement('input', { type: 'name', id: 'name', placeholder: 'Your Name' }),
												React.createElement('br', null),
												React.createElement('input', { type: 'email', id: 'email', placeholder: 'Email', required: true }),
												React.createElement('br', null),
												React.createElement('input', { type: 'name', id: 'movie_name', placeholder: 'Movie Name', required: true }),
												React.createElement('br', null),
												React.createElement('input', { type: 'url', id: 'image_url', placeholder: 'Image', required: true }),
												React.createElement('br', null),
												React.createElement(
																'button',
																{ onClick: this.handle_click },
																'Add'
												)
								);
				}
}