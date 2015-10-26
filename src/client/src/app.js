import React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';
import Connect from './components/Connect';

let rootElement = document.getElementById('root-element');

if (rootElement) {
  render(
    <Root />,
    rootElement
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