'use strict';

const suite = { EXP: require('../') };


function getDeviceCredentials () {
  return { uuid: 'test-uuid', secret: 'test-secret', host: 'http://localhost:8081' };
}

function getUserCredentials () {
  return { username: 'test@test.com', password: '12345test', organization: 'scala', host: 'http://localhost:8081'};
}

function getConsumerAppCredentials () {
  return { uuid: 'test-uuid', apiKey: 'test-api-key', host: 'http://localhost:8081' };
}

function getPairingDeviceCredentials () {
  return { allowPairing: true, host: 'http://localhost:8081' };
}

function setup () {
  suite.credentials = {
    'device': getDeviceCredentials(),
    'user': getUserCredentials(),
    'consumer': getConsumerAppCredentials(),
    'pairing': getPairingDeviceCredentials()
  };
  suite.startAsDevice = () => suite.EXP.start(suite.credentials.device);
  suite.startAsUser = () => suite.EXP.start(suite.credentials.user);
  suite.startAsConsumer = () => suite.EXP.start(suite.credentials.consumer);
  suite.startAsPairing = () => suite.EXP.start(suite.credentials.pairing);
}

function tearDown () {
  suite.EXP.stop();
}

beforeEach(() => setup());
afterEach(() => tearDown());
setup();



require('./start.spec')(suite);
require('./events.spec')(suite);
require('./stop.spec')(suite);
require('./clone.spec')(suite);
require('./getAuth.spec')(suite);
require('./getChannel.spec')(suite);
require('./isConnected.spec')(suite);

require('./exp1511.spec')(suite);

require('./get.spec')(suite);
require('./post.spec')(suite);
require('./patch.spec')(suite);
require('./put.spec')(suite);
require('./delete.spec')(suite);


require('./Channel.spec')(suite);
require('./Device.spec')(suite);
require('./Thing.spec')(suite);
require('./Experience.spec')(suite);

require('./Location.spec')(suite);
require('./Zone.spec')(suite);

require('./Feed.spec')(suite);
require('./Content.spec')(suite);
require('./Data.spec')(suite);

