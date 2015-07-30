const scala = require('../src/scala');

//scala.credentials.set('ee146ed3-437a-46cd-89e1-f91ce8bbb942', 'DEVICE-SECRET');
/*scala.connection.connect();
scala.connection.events.on('online', () => {
  scala.api.getCurrentDevice().then(device => {
    device.getExperience().then(experience => {
      console.log(experience.raw);
      experience.broadcast({
        scope: 'location',
        name: 'hi',
        topic: 'dude',
        channel: 'private',
        payload: { 'test': 12}
      });
    });
  });
});*/

scala.connection.connect();
scala.connection.events.on('online', () => {
  scala.channels.system.broadcast({
    name: 'test',
    topic: 'test2'
  });
  scala.channels.experience.broadcast({
    name: 'test3',
    topic: 'test4'
  });
});

