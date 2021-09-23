import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'


export class Home extends Component {
	static displayName = Home.name;

	constructor(props) {
		super(props);
		this.state = {
			contacts: [], loading: true };
	}

	componentDidMount() {
		this.fetchContacts();
	}

	static renderContacts(contacts) {
		return (<div>a
			{contacts.map(contact =>
				<h2>{contact.id}, {contact.name}, {contact.surname}, {contact.phone} </h2>
			)}
		</div>
		);
    }

	async fetchContacts(){
		const token = await authService.getAccessToken();
		const response = await fetch('Home', {
			headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({ contacts: data, loading: false });
	}

	render() {
		let content = this.state.loading ? <p><em>Loading...</em></p> : Home.renderContacts(this.state.contacts);
		return (
			<div>
			<h1>Moje kontakty</h1>
				{content}
			</div>
		);
	}
}
