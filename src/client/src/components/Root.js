import React, { Component } from 'react';
import RequestPanel from './RequestPanel';

export default class Root extends Component {

  render() {
    return (
      <div>
        <RequestPanel url="/org/" title="Get orgs" />
        <RequestPanel url="/org/:id/test/:app" title="Get single org" params={{ id: 'integer', app: 'integer' }} />
        <RequestPanel url="/user/" title="Get User" />
      </div>
    );
  }
}