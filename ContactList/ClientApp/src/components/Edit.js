import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import authService from './api-authorization/AuthorizeService';

export class Edit extends Component {
	static displayName = Edit.name;

	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			contacts: [],
			thisContact: [],
			loading: true,
			foundEmail: false,
			securePassword: false,
			validPhone: false,
			firstname: '',
			surname: '',
			email: '',
			password: '',
			category: 1,
			phone: null,
			date: null,
			redirectToReferrer: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.fetchCategories();
		this.fetchContacts();
		this.fetchThisContact();
	}

	handleSubmit(event) {
		event.preventDefault();
		this.updateContact();
	}


	handleChange(ev)  {
		let nam = ev.target.name;
		let val = ev.target.value;
		this.setState({
			[nam]: val
		});


		switch (nam) {
			case 'email':
				if (nam == 'email' && val != this.state.thisContact.email) {
					this.setState({ foundEmail: false });
					for (var i = 0; i < this.state.contacts.length; i++) {
						if (this.state.contacts[i].email == val) {
							this.setState({ foundEmail: true });
							break;
						}

					}
				}
				break;

			case 'password':
				this.password_validator(val);
				break;

			case 'phone':
				this.phone_validator(val);
				break;
        }

	}

	password_validator(password) {
		var re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%\^&\*])(?=.{8,})");
		this.setState({ securePassword: false });
		if (re.test(password)) {
			this.setState({ securePassword: true });
        }
	}

	phone_validator(phone) {
		var re = /^(?:(?:(?:\+|00)?48)|(?:\(\+?48\)))?(?:(?:1[2-8]|2[2-69]|3[2-49]|4[1-8]|5[0-9]|6[0-9]|[7-8][1-9]|9[145])\d{7}|(?:(?:70[01346-8]|80[014]))\d{6})$/;
		this.setState({ validPhone: false });
		if (re.test(phone)) {
			this.setState({ validPhone: true });
        }
	}

	async fetchThisContact() {
		const token = await authService.getAccessToken();
		const response = await fetch('api/contact/' + this.props.match.params.cId, {
			headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
		});
		const data = await response.json();


		this.setState({
			firstname: data.name,
			surname: data.surname,
			email: data.email,
			password: data.password,
			category: data.category.id,
			phone: data.phone,
			date: new Date(data.birthDate).getFullYear() + "-" + ((new Date(data.birthDate).getMonth() + 1) < 10 ? "0" : "") + (new Date(data.birthDate).getMonth() + 1) + "-" + ((new Date(data.birthDate).getDate()) < 10 ? "0" : "") + new Date(data.birthDate).getDate(),
			thisContact: data
		})

		this.password_validator(this.state.password);
		this.phone_validator(this.state.phone);

    }

	
	async fetchContacts() {
		const token = await authService.getAccessToken();
		const response = await fetch('api/home', {
			headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({ contacts: data });
    }

	async fetchCategories() {
		const token = await authService.getAccessToken();
		const response = await fetch('api/category', {
			headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({
			categories: data,
			loading: false
		});
	}

	async updateContact() {
		const newContact = {
			id: this.props.match.params.cId,
			name: this.state.firstname,
			surname: this.state.surname,
			email: this.state.email,
			password: this.state.password,
			phone: this.state.phone,
			birthDate: this.state.date,
			category: {
				id: this.state.category
			}
		}
		const token = await authService.getAccessToken();
		const postMethod = {
			method: 'PUT',
			headers: !token ? { 'Content-type': 'application/json; charset=UTF-8' } : { 'Content-type': 'application/json; charset=UTF-8', 'Authorization': `Bearer ${token}` },
			body: JSON.stringify(newContact)
		}
		await fetch('api/contact/update/' + this.props.match.params.cId, postMethod);
		//window.location.replace('/');

		this.setState({ redirectToReferrer: true })
    }
	

	render() {
		let content = this.state.loading ? <p><em>Loading...</em></p> : <span></span>;
		const redirectToReferrer = this.state.redirectToReferrer;
		if (redirectToReferrer) {
			return <Redirect to="/" />
		}

		return (
			<div>
				{content}
				<form onSubmit={this.handleSubmit}>
					<div class="form-group">
						<label for="firstname">Imię</label>
						<input type="text" class="form-control" name="firstname" id="firstname" placeholder="Wpisz imię" value={this.state.firstname} onChange={this.handleChange} required/>

					</div>
					<div class="form-group">
						<label for="surname">Nazwisko</label>
						<input type="text" class="form-control" name="surname" id="surname" placeholder="Wpisz nazwisko" value={this.state.surname} onChange={this.handleChange} required/>
					</div>
					<div class="form-group">
						<label for="name">E-mail</label>
						<small style={{ "marginLeft": "10px", "color": "red" }}>{this.state.foundEmail ? "Taki e-mail znajduje się już w bazie." : "" }</small>
						<input type="email" class="form-control" name="email" id="email" placeholder="Wpisz e-mail" value={this.state.email} onChange={this.handleChange} required/>
					</div>
					<div class="form-group">
						<label for="password">Hasło</label>
						<small style={{ "marginLeft": "10px", "color": "red" }}>{this.state.securePassword ? "" : "Hasło nie jest bezpieczne"}</small>
						<input type="password" class="form-control" name="password" id="name" placeholder="Wpisz hasło" value={this.state.password} onChange={this.handleChange} required/>
					</div>
					<div class="form-group">
						<label for="category">Kategoria</label>
						<select class="form-control" name="category" id="category" value={this.state.category} onChange={this.handleChange}>
							{this.state.categories.map(category =>
								<option value={category.id}>{category.name}</option>
							)}
						</select>
					</div>
					<div class="form-group">
						<label for="phone">Telefon</label>
						<small style={{ "marginLeft": "10px", "color": "red" }}>{this.state.validPhone ? "" : "Nieprawidłowy format numeru"}</small>
						<input type="number" class="form-control" name="phone" id="phone" placeholder="Wpisz numer telefonu" value={this.state.phone} onChange={this.handleChange} required/>
					</div>
					<div class="form-group">
						<label for="date">Data urodzenia</label>
						<input type="date" class="form-control" name="date" id="date" value={this.state.date} onChange={this.handleChange} required />
					</div>
					<input
						type="submit"
						class={this.state.foundEmail ? "btn btn-primary disabled" : "btn btn-primary"}
						disabled={this.state.foundEmail || !this.state.securePassword || !this.state.validPhone}
						value="Zapisz" />
				</form>
			</div>	
			);
	}
}
