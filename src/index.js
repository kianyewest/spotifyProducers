import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {DataLayer} from "./DataLayer"
import reducer, {initialState} from "./reducer"

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    {/* This is our context, we pass it the initial state and reducer */}
    <DataLayer initialState={initialState} reducer={reducer}>
    
      <App />
      
    </DataLayer>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
