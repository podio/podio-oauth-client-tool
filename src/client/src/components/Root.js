import React, { Component } from 'react';
import { Link } from 'react-router';
import RequestPanel from './RequestPanel';

export default class Root extends Component {
  render() {
    return (
      <div className="root">
        <ul>
          <li><Link to="/apps">Apps</Link></li>
          <li><Link to="/orgs">Orgs</Link></li>
          <li><Link to="/conversations">Conversations</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/search">Search</Link></li>
          <li><Link to="/spaces">Spaces</Link></li>
          <li><Link to="/tasks">Tasks</Link></li>
        </ul>
        { this.props.children }
      </div>
    );
  }
}