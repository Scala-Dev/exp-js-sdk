const scala = require('..//src/scala');

//scala.credentials.set('ee146ed3-437a-46cd-89e1-f91ce8bbb942', 'DEVICE-SECRET');
scala.connection.connect();
scala.connection.events.on('online', () => {
  scala.getCurrentDevice().then(device => {
    console.log('ok1');
    device.getExperience().then(experience => {
      console.log('ok');
      console.log(experience);
    });
    device.getPlans().then(plan => {
/*
      console.log(plan);
      console.log('ok2');*/
    });
  });        
});



/*scala.credentials.generateToken()
  .then(() => {})
  .catch(error => {
    console.log(error);
    console.log(error.stack);
  });
*/
