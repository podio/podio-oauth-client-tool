import React, { Component } from 'react';
import RequestPanel from './RequestPanel';
import Section from './Section';

export default class Root extends Component {

  render() {
    return (
      <div className="root">
        <Section title="Apps">
          <RequestPanel url="/app/" method="POST" title="Create new app" body={{
            space_id: 'integer',
            config: {
              name: 'string',
              type: 'string'
            }
          }} />
          <RequestPanel url="/app/:app_id" title="Get app" />
          <RequestPanel url="/app/:app_id" method="DELETE" title="Delete App" />
        </Section>
        <Section title="Orgs">
          <RequestPanel url="/org/" title="Get orgs" />
        </Section>
        <Section title="User">
          <RequestPanel url="/user/" title="Get User" />
          <RequestPanel url="/user/status" title="Get User Status" />
        </Section>
        <Section title="Tasks">
          <RequestPanel url="/task/:task_id" title="Get Task" />
          <RequestPanel url="/task/:task_id" method="DELETE" title="Delete Task" />
        </Section>
        <Section title="Spaces">
          <RequestPanel url="/space/:space_id" title="Get Space" />
        </Section>
      </div>
    );
  }
}