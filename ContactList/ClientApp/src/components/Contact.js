import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService';
import { Link, Redirect } from 'react-router-dom';
import { useParams } from 'react-router-dom'



export class Contact extends Component {
	static displayName = Contact.name;

	constructor(props) {
		super(props);
		if (this.props.match.params.cId == ":cId") {
			window.location.replace('/');
        }
		this.param = this.props.match.params.cId;
		this.options = { year: 'numeric', month: 'long', day: 'long' };
		this.state = {
			contact: [], loading: true
		};

		this.deleteContact = this.deleteContact.bind(this);
	}

	componentDidMount() {
		this.fetchContacts();
	}

	static renderContacts(contact) {
		return (
			<div class="container">
				<div class="row border-bottom">
					<h3>{contact.name} {contact.surname}</h3>
				</div>
				<br />
				<div>
					<b>E-mail</b>: {contact.email}<br/>
					<b>Hasło</b>: {contact.password}<br/>
					<b>Numer telefonu</b>: {contact.phone}<br />
					<b>Data urodzenia</b>: {new Date(contact.birthDate).toLocaleDateString()}<br />
					<b>Kategoria</b>: {contact.category.name}<br/>
				</div>
			</div>
			
		);
	}

	async fetchContacts() {
		const token = await authService.getAccessToken();
		const response = await fetch('api/contact/' + this.props.match.params.cId, {
			headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({ contact: data, loading: false });
	}

	async deleteContact() {
		const token = await authService.getAccessToken();
		await fetch('api/contact/delete/' + this.state.contact.id, {
			method: 'DELETE',
			headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
		});
		window.location.replace('/');
    }

	render() {
		let content = this.state.loading ? <p><em>Loading...</em></p> : Contact.renderContacts(this.state.contact);
		return (
			<div>
				<h1 style={{ "marginBottom": "20px" }}>Moje kontakty</h1>
				{content}
				<Link to={"/cedit/" + this.props.match.params.cId} className="btn btn-warning">Edytuj</Link>
				<button onClick={this.deleteContact} className="btn btn-danger">Usuń</button>
			</div>
		);
	}
}
