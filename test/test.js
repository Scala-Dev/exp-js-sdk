const scala = require('../src/scala');

scala.credentials.set('ee146ed3-437a-46cd-89e1-f91ce8bbb942', 'DEVICE-SECRET');
scala.connection.connect();
scala.connection.events.on('online', () => {
  scala.api.getDevices().then(devices => {
    console.log(devices[0].uuid);
    scala.api.getDevice({ uuid: devices[12].uuid })
      .then(device => {
        console.log(device);
      });
  }).catch(error => {
    console.error(error.stack);
  });

});



/*scala.credentials.generateToken()
  .then(() => {})
  .catch(error => {
    console.log(error);
    console.log(error.stack);
  });
*/
