import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService';
import { Link } from 'react-router-dom';


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
		return (<div>
			{contacts.map(contact =>
				<div>
					<div class="row border-bottom">
						<div class="col-9">
							<h3>{contact.name} {contact.surname}</h3>
						</div>
						<div class="col-3">
							<Link to={"/contact/" + contact.id} class="btn btn-info" style={{ "width": "100%" }}>Zobacz</Link>
						</div>
					</div>
					<br />
				</div>
			)}
		</div>
		);
    }

	async fetchContacts(){
		const token = await authService.getAccessToken();
		const response = await fetch('api/home', {
			headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
		});
		const data = await response.json();
		this.setState({ contacts: data, loading: false });
	}

	render() {
		let content = this.state.loading ? <p><em>Loading...</em></p> : Home.renderContacts(this.state.contacts);
		return (
			<div>
				<h1 style={{ "marginBottom": "20px"}}>Moje kontakty</h1>
				{content}
			</div>
		);
	}
}
