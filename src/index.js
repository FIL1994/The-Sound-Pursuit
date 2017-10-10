/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);