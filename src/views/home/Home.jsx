import './home.scss';
import React, { Component } from 'react';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import Call from '../Call';

class Home extends Component {
  constructor() {
    super();
    this.backoffTime = 4000;
    this.state = {
      status: 'Loading...',
      error: false,
      caller: '',
      stage: 'waiting',
      dialNumber: '',
      callList: null,
      muted: false,
      newUsername: this.getUsername(),
    }
  }

  componentDidMount() {
    this.connect();

    Twilio.Device.ready( device => {
      this.backoffTime = 5000;
      this.setState({
        status: 'Ready',
        error: false
      });
    });

    Twilio.Device.error( error => {
      console.error( error );
      this.setState({
        status: 'An error occured',
        error: true
      });
    });

    Twilio.Device.offline(() => {
      this.setState({
        status: 'Offline',
        error: true
      });
    });

    Twilio.Device.incoming( connection => {
      if ( this.state.stage === 'waiting' ) {
        this.setState({
          status: 'Incoming call',
          stage: 'incoming',
          error: false,
          caller: connection.parameters.From
        });

        this.focusWindow();
      }
    });

    Twilio.Device.disconnect( connection => {
      this.setState({
        status: 'Ready',
        error: false,
        stage: 'waiting',
        caller: '',
      });

      this.getCallList();
    });

    Twilio.Device.cancel( connection => {
      this.setState({
        status: 'Ready',
        error: false,
        stage: 'waiting',
        caller: '',
      });

      this.getCallList();
    });

    /* Get the call list on a regular basis */
    this.getCallList();

    setInterval(() => {
      this.getCallList();
    }, 60000);

    /* Start a timer that makes sure we always stay connected */
    setInterval(() => {
      if ( Twilio.Device.status() === 'offline' ) {
        console.log( 'Offline - Attempting connection' );
        this.connect();

        /* Increase backoff time */
        this.backoffTime+=5000;
      }
    }, this.backoffTime);
  }

  connect() {
    Twilio.Device.destroy();
    const token = this.getToken();
    Twilio.Device.setup( token );
  }

  getToken() {
    const token = require( 'electron' ).remote.require( './twilio.js' ).getToken( this.getUsername());
    return token;
  }

  getUsername = () => {
    if ( localStorage.getItem( 'username' ) == null || localStorage.getItem( 'username' ) === '' ) {
      return 'support_agent';
    } else {
      return localStorage.getItem( 'username' );
    }
  }

  focusWindow() {
    const token = require( 'electron' ).remote.getCurrentWindow().focus();
  }

  getCallList() {
    require( 'electron' ).remote.require( './twilio.js' ).getCalls( calls => {
      this.setState({ callList: calls });
    });
  }

  acceptCall = () => {
    Twilio.Device.activeConnection().accept();
    this.setState({
      status: 'In call',
      error: false,
      stage: 'active',
    });
  }

  declineCall = () => {
    Twilio.Device.activeConnection().ignore();
    this.setState({
      status: 'Ready',
      error: false,
      stage: 'waiting',
      caller: '',
    });
  }

  disconnectCall = () => {
    Twilio.Device.activeConnection().disconnect();
    this.getCallList();
  }

  toggleMute = () => {
    const muted = Twilio.Device.activeConnection().isMuted();
    Twilio.Device.activeConnection().mute( !muted );
    this.setState({ muted: !muted });
  }

  showDialer = () => {
    this.setState({
      stage: 'make'
    });
  }

  showPhone = () => {
    this.setState({
      stage: 'waiting'
    });
  }

  dial = () => {
    const { dialNumber } = this.state;
    const numberWithArea = dialNumber.length === 8 ? `03${dialNumber}` : dialNumber;
    /* Format the value */
    const phoneUtils = PhoneNumberUtil.getInstance();
    let formattedNumber = null;
    if (dialNumber.match(/[a-z]/i)) {
      formattedNumber = dialNumber;
    } else {
      const number = phoneUtils.parse( numberWithArea, 'AU' );
      formattedNumber = phoneUtils.format( number, PhoneNumberFormat.E164 );
    }

    if ( formattedNumber ) {
      /* Dial the number */
      Twilio.Device.connect({ phoneNumber: formattedNumber });

      this.setState({
        status: 'In call',
        error: false,
        stage: 'active',
        caller: formattedNumber
      });
    }
  }

  onDialerChange = e => {
    let value = e.target.value;
    this.setState({ dialNumber: value });
  }

  onUsernameChange = e => {
    let value = e.target.value;
    this.setState({ newUsername: value });
  }

  saveUser = () => {
    localStorage.setItem( 'username', this.state.newUsername );
    this.connect();
    this.showPhone();
  }

  showSettings = () => {
    this.setState({
      stage: 'settings',
    });
  }

  renderButtonsWaiting() {
    return (
      <div className="buttons animated fadeInDown waiting">
        <i className="material-icons make" onClick={this.showDialer}>phone</i>
      </div>
    )
  }

  renderButtonsIncoming() {
    return (
      <div className="buttons animated fadeInDown incoming">
        <i className="material-icons decline" onClick={this.declineCall}>call_end</i>
        <i className="material-icons accept" onClick={this.acceptCall}>call</i>
      </div>
    )
  }

  renderButtonsActive() {
    const { muted } = this.state;
    const mutedIcon = muted ? 'volume_off' : 'volume_up';
    const mutedClass = muted ? 'decline' : 'make';
    return (
      <div className="buttons animated fadeInDown active">
        <i className="material-icons decline" onClick={this.disconnectCall}>call_end</i>
        <i className={`material-icons ${mutedClass}`} onClick={this.toggleMute}>{mutedIcon}</i>
      </div>
    )
  }

  renderDialer() {
    const { dialValue } = this.state;
    return (
      <div className="dialer">
        <div className="button back" onClick={this.showPhone}>Back</div>
        <p>Enter a phone number below</p>
        <input type="text" onChange={e => this.onDialerChange(e)} defaultValue={dialValue} />
        <div className="button dial" onClick={this.dial}>Dial</div>
      </div>
    )
  }

  renderSettings() {
    return (
      <div className="settings-page">
        <div className="button back" onClick={this.showPhone}>Back</div>
        <p>Enter username below</p>
        <input type="text" onChange={e => this.onUsernameChange(e)} defaultValue={this.getUsername()} />
        <div className="button dial" onClick={this.saveUser}>Update</div>
      </div>
    );
  }

  render() {
    const { status, caller, stage, callList } = this.state;
    return (
      <div className="app">
        <div className="home">
          { stage === 'waiting' && this.renderButtonsWaiting() }
          { stage === 'incoming' && this.renderButtonsIncoming() }
          { stage === 'active' && this.renderButtonsActive() }
          { stage === 'settings' && this.renderSettings() }
          { stage === 'make' && this.renderDialer() }
          { stage !== 'make' && stage !== 'settings' && (
            <div>
              <h1>{status}</h1>
              <p>{caller}</p>
              <div className="settings" onClick={this.showSettings}>
                <i className="material-icons">settings</i>
              </div>
            </div>
          )}
        </div>
        <div className="call-list">
          { callList == null && <div className="loading">Loading...</div> }
          { callList && (
            callList.map( call => <Call key={call.sid} call={call} /> )
          )}
        </div>
      </div>
    );
  }
}

export default Home;
