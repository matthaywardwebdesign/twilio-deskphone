import 'styles/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'views/store';
import { BrowserRouter as Router } from 'react-router-dom';
import { App } from 'views';


const Root = (
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);

ReactDOM.render( Root, document.getElementById( 'root' ));
