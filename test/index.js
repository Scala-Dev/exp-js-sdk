'use strict';

const exp = require('../');
const suite = {};


function getDeviceCredentials () {
  return { uuid: 'test-uuid', secret: 'test-secret', host: 'http://localhost:9000' };
}

function getUserCredentials () {
  return { username: 'test@goexp.io', password: 'test-Password1', organization: 'scala', host: 'http://localhost:9000'};
}

function getConsumerAppCredentials () {
  return { uuid: 'test-uuid', apiKey: 'test-api-key', host: 'http://localhost:9000' };
}

function getPairingDeviceCredentials () {
  return { allowPairing: true, host: 'http://localhost:9000' };
}

let sdk;
beforeEach(() => {
  sdk = exp.fork();
  suite.exp = sdk;
  suite.credentials = {
    'device': getDeviceCredentials(),
    'user': getUserCredentials(),
    'consumer': getConsumerAppCredentials(),
    'pairing': getPairingDeviceCredentials()
  };
});
afterEach(() => {
  try {sdk.stop(); }
  catch (exception) {}
});

suite.credentials = {
  'device': getDeviceCredentials(),
  'user': getUserCredentials(),
  'consumer': getConsumerAppCredentials(),
  'pairing': getPairingDeviceCredentials()
};
suite.exp = exp;


//require('./start.spec')(suite);
//require('./events.spec')(suite);
//require('./stop.spec')(suite);
//require('./clone.spec')(suite);
//require('./fork.spec')(suite);
//require('./getAuth.spec')(suite);
//require('./getChannel.spec')(suite);
//require('./isConnected.spec')(suite);

//require('./exp1511.spec')(suite);
//require('./get.spec')(suite);
//require('./post.spec')(suite);
//require('./patch.spec')(suite);
//require('./put.spec')(suite);
//require('./delete.spec')(suite);


//require('./Channel.spec')(suite);
//require('./Device.spec')(suite);
//require('./Thing.spec')(suite);
//require('./Experience.spec')(suite);

require('./Location.spec')(suite);


