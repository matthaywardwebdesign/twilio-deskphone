import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home } from 'views';

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route component={Home} />
      </Switch>
    )
  }
}

export default Routes;
