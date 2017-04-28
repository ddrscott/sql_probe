import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

$(document).ready(function(){
  var $root = document.getElementById('root');
  if ($root) {
    ReactDOM.render(<App />, $root);
  }
});
