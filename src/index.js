/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import {startSession, getDateTime, initSession} from './ng/NG_Connect';

import App from './App';
import reducers from './reducers';
import './setupSoundJS';

const store = createStore(reducers, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <Provider store={store}><App/></Provider>,
  document.getElementById('root')
);

// NG Start Session
initSession();
startSession();
getDateTime();