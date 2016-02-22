import React, { Component } from 'react';
import RequestPanel from './RequestPanel';

export class Apps extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/app/" method="POST" title="Create new app" body={{
          space_id: 'integer',
          config: {
            name: 'string',
            type: 'string',
            item_name: 'string',
            icon: 'string'
          }
        }} />
        <RequestPanel url="/app/:app_id" title="Get app" />
        <RequestPanel url="/app/:app_id" method="DELETE" title="Delete App" />
      </div>
    );
  }
}

export class Conversations extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/conversation/:conversation_id" title="Get conversation" />
      </div>
    );
  }
}

export class Globiflow extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/globiflow/org" title="Get list of orgs" />
        <RequestPanel url="/globilow/org/:org_id" title="Get org" />
        <RequestPanel url="/globiflow/settings" title="Get settings" />
        <RequestPanel url="/globiflow/settings" method="PUT" title="Put settings" body={{app_button: "boolean"}}/>
      </div>
    );
  }
}

export class Batches extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/batch/" title="Get Batches" body={{view: 'string'}} />
      </div>
    );
  }
}

export class AuthClients extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/oauth/grant/client" title="Get granted clients" />
      </div>
    );
  }
}

export class Items extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/item/:item_id" title="Get item by id" />
        <RequestPanel url="/item/app/:app_id/external_id/:external_id" title="Get item by external_id" />
        <RequestPanel url="/app/:app_id/item/:app_item_id" title="Get item by app_item_id" />
        <RequestPanel url="/item/:item_id" method="DELETE" title="Delete item by id" />
        <RequestPanel url="/item/app/:app_id" method="POST" title="Create item" body={{
          fields: {
            title: "string"
          }
        }}/>
        <RequestPanel url="/item/:item_id" method="PUT" title="Update item" body={{
          fields: {
            title: 'string'
          }
        }}/>
      </div>
    );
  }
}

export class Orgs extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/org/" title="Get orgs" />
        <RequestPanel url="/org/:org_id" title="Get org" />
        <RequestPanel url="/org/:org_id/all_spaces/" title="Get all org spaces" />
      </div>
    );
  }
}

export class References extends Component {
  render() {
    return (
    <RequestPanel url="reference/search/" method="POST" title="Search for references with an app target" body={{
          target: 'string',
          target_params: {
            app_id: 'integer'
          }
        }}/>
    );
  }
}

export class Search extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/search/v2?query=string" title="Search globally v2" />
        <RequestPanel url="/search/" method="POST" title="Search globally v1" body={{
          query: 'string'
        }}/>
        <RequestPanel url="/search/app/:app_id/v2?query=string" title="Search in app v2" />
        <RequestPanel url="/search/app/:app_id/" method="POST" title="Search in app v1" body={{
          query: 'string'
        }}/>
        <RequestPanel url="/search/org/:org_id/v2?query=string" title="Search in org v2" />
        <RequestPanel url="/search/org/:org_id/" method="POST" title="Search in org v1" body={{
          query: 'string'
        }}/>
        <RequestPanel url="/search/space/:space_id/v2?query=string" title="Search in space v2" />
        <RequestPanel url="/search/space/:space_id/" method="POST" title="Search in space v1" body={{
          query: 'string'
        }}/>
        <RequestPanel url="/search/app/:app_id/space/:space_id?query=string&ref_type=string&counts=boolean" title="Search by app in space" />
      </div>
    );
  }
}

export class Spaces extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/space/:space_id" title="Get Space" />
      </div>
    );
  }
}

export class Tasks extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/task/:task_id" title="Get Task" />
        <RequestPanel url="/task/" method="POST" title="Create Task" body={{
          text: 'string',
          responsible: 'integer',
          private: 'boolean'
        }} />
        <RequestPanel url="/task/:task_id" method="DELETE" title="Delete Task" />
      </div>
    );
  }
}

export class Users extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/user/" title="Get User" />
        <RequestPanel url="/user/status" title="Get User Status" />
      </div>
    );
  }
}