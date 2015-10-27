import React, { Component } from 'react';
import RequestPanel from './RequestPanel';
import Section from './Section';

export default class Root extends Component {

  render() {
    return (
      <div className="root">
        <Section title="Orgs">
          <RequestPanel url="/app/:app_id" title="Get app" params={{app_id: 'integer'}} />
        </Section>
        <Section title="Apps">
          <RequestPanel url="/org/" title="Get orgs" />
          <RequestPanel url="/org/:id/test/:app" title="Get single org" params={{ id: 'integer', app: 'integer' }} />
        </Section>
        <Section title="User">
          <RequestPanel url="/user/" title="Get User" />
        </Section>
        <Section title="Spaces">
          <RequestPanel url="/space/:space_id" title="Get Space" params={{ space_id: 'integer' }} />
        </Section>
      </div>
    );
  }
}