import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService';
import { Link, Redirect } from 'react-router-dom';
import { useParams } from 'react-router-dom'



export class New extends Component {
	static displayName = New.name;

	constructor(props) {
		super(props);
		this.state = {
			categories: [], loading: true
		};
	}

	componentDidMount() {
		this.fetchCategories();
	}

	async fetchCategories() {
		const token = await authService.getAccessToken();
		const response = await fetch('api/home', {
			headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({ categories: data, loading: false });
	}

	static renderForm(categories) {
		return (
			<form>
				<div class="form-group">
					<label for="firstname">Imię</label>
					<input type="text" class="form-control" name="firstname" id="firstname" placeholder="Wpisz imię" />
				</div>
				<div class="form-group">
					<label for="surname">Nazwisko</label>
					<input type="text" class="form-control" name="surname" id="surname" placeholder="Wpisz nazwisko" />
				</div>
				<div class="form-group">
					<label for="name">E-mail</label>
					<input type="email" class="form-control" name="email" id="email" placeholder="Wpisz e-mail" />
				</div>
				<div class="form-group">
					<label for="password">Hasło</label>
					<input type="password" class="form-control" name="password" id="name" placeholder="Wpisz hasło" />
				</div>
				<div class="form-group">
					<label for="category">Kategoria</label>
					<select class="form-control" name="category" id="category">
						{categories.map(category => 
							<option>{category.name}</option>
						)}
					</select>
				</div>
				<div class="form-group">
					<label for="phone">Telefon</label>
					<input type="number" class="form-control" name="phone" id="phone" placeholder="Wpisz numer telefonu" />
				</div>
				<div class="form-group">
					<label for="date">Data urodzenia</label>
					<input type="date" class="form-control" name="date" id="date" />
				</div>
				<button type="submit" class="btn btn-primary">Submit</button>
			</form>
		)
    }

	render() {
		let content = this.state.loading ? <p><em>Loading...</em></p> : New.renderForm(this.state.categories);
		return (
				<div>
					{content}
				</div>	
				);
			}
}
