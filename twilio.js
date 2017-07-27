const config = require( './config.json' );
const axios = require( 'axios' );
const { accountSid, authToken, applicationSid, incomingNumber } = config;
const ClientCapability = require('twilio').jwt.ClientCapability;

class Twilio {
  getToken( username ) {
    if ( username == null || username.trim() === '' ) {
      username = 'support_agent';
    }

    const capability = new ClientCapability({
      accountSid,
      authToken
    });

    capability.addScope(new ClientCapability.IncomingClientScope(username));
    capability.addScope(new ClientCapability.OutgoingClientScope({
      applicationSid,
    }));

    return capability.toJwt();
  }

  getCalls( callback ) {
    axios({
      method: 'get',
      url: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json?Status=Completed&To=${incomingNumber}&Direction=inbound&PageSize=25`,
      auth: {
        username: accountSid,
        password: authToken,
      },
    }).then( response => {
      callback( response.data.calls );
    });
  }
}

module.exports = new Twilio();
