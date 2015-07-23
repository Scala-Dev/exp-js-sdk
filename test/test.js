const scala = require('..//src/scala');

//scala.credentials.set('ee146ed3-437a-46cd-89e1-f91ce8bbb942', 'DEVICE-SECRET');
scala.connection.connect();
scala.connection.events.on('online', () => {
  scala.interface.request({ target: { device: 'system' }, name: 'getCurrentExperience' })
    .then(experience => {
      console.log(experience);
    })
    .catch(error => { console.error(error); });
          
});



/*scala.credentials.generateToken()
  .then(() => {})
  .catch(error => {
    console.log(error);
    console.log(error.stack);
  });
*/
