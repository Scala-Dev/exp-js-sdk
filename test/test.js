const scala = require('../src/scala');

//scala.credentials.set('ee146ed3-437a-46cd-89e1-f91ce8bbb942', 'DEVICE-SECRET');
scala.connection.connect();
scala.connection.events.on('online', () => {
  scala.api.getCurrentDevice().then(device => {
    device.getExperience().then(experience => {
      console.log(experience.raw);
      experience.broadcast({
        target: {
          device: '*'
        },
        name: 'hi!',
        payload: { 'test': 12}
      });
    });
  });
});

