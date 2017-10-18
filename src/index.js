/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
require('babel-polyfill');

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';

import App from './App';
import reducers from './reducers';

// development only
import resetData from './data/resetData';
window.resetData = resetData;

const store = createStore(reducers, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <Provider store={store}><App/></Provider>,
  document.getElementById('root')
);