import React from 'react';
import { render } from 'react-dom';
import { Root, Connect } from './components';

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