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
        <Section title="Conversations">
          <RequestPanel url="/conversation/:conversation_id" title="Get conversation" />
        </Section>
        <Section title="Orgs">
          <RequestPanel url="/org/" title="Get orgs" />
          <RequestPanel url="/org/:org_id" title="Get org" />
          <RequestPanel url="/org/:org_id/all_spaces/" title="Get all org spaces" />
        </Section>
        <Section title="User">
          <RequestPanel url="/user/" title="Get User" />
          <RequestPanel url="/user/status" title="Get User Status" />
        </Section>
        <Section title="Search">
          <RequestPanel url="/search/app/:app_id/space/:space_id?query=string&ref_type=string&counts=boolean" title="Search by app in space" />
        </Section>
        <Section title="Spaces">
          <RequestPanel url="/space/:space_id" title="Get Space" />
        </Section>
        <Section title="Tasks">
          <RequestPanel url="/task/:task_id" title="Get Task" />
          <RequestPanel url="/task/" method="POST" title="Create Task" body={{
            text: 'string',
            responsible: 'integer',
            private: 'boolean'
          }} />
          <RequestPanel url="/task/:task_id" method="DELETE" title="Delete Task" />
        </Section>
      </div>
    );
  }
}