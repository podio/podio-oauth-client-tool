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

export class Conversations extends Component {
  render() {
    return (
      <div>
        <RequestPanel url="/conversation/:conversation_id" title="Get conversation" />
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

export class Search extends Component {
  render() {
    return (
      <div>
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