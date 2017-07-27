import config from 'config';
import React, { Component } from 'react';
import Routes from '../Routes.jsx';

class App extends Component {
  componentDidMount() {
    /* Remove the loading spinner */
    document.getElementById( 'mounting-preview' ).remove();
  }

  render() {
    return (
        <Routes />
    );
  }
}

export default App;
