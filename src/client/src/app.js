import React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';
import Connect from './components/Connect';
import { Router, Route, IndexRoute } from 'react-router';
import * as routes from './components/Routes';

let rootElement = document.getElementById('root-element');

if (rootElement) {
  render(
    <Router>
      <Route path="/" component={Root}>
        <Route path="apps" name="apps" component={routes.Apps} />
        <Route path="orgs" name="orgs" component={routes.Orgs} />
        <Route path="conversations" name ="conversations" component={routes.Conversations} />
        <Route path="users" name ="users" component={routes.Users} />
        <Route path="search" name="search" component={routes.Search} />
        <Route path="spaces" name="spaces" component={routes.Spaces} />
        <Route path="tasks" name ="tasks" component={routes.Tasks} />
      </Route>
    </Router>
    , rootElement
  );
}

let authElement = document.getElementById('auth-element');

if (authElement) {

  let authUrl = authElement.getAttribute('data-auth-url');
  render(

    <Connect authUrl={authUrl} />,
    authElement
  );
}