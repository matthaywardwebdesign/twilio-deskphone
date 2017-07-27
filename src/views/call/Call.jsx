import './call.scss';
import React, { Component } from 'react';
import moment from 'moment';

class Call extends Component {
  render() {
    const { call } = this.props;
    return (
      <div className="call">
        <small>{moment( call.start_time ).fromNow()}</small>
        {call.from.replace( '+61', '0' )}
      </div>
    );
  }
}

export default Call;
