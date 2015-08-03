const scala = require('../src/scala');

/* TEST R-R Pattern */
scala.init({
  host: 'http://localhost:9000',
  uuid: 'de710dcd-2e09-447d-9ae4-5050d73358c1',
  secret: 'DEVICE-SECRET'
}).then(() => {
  scala.channels.organization.respond({ name: 'hi' }, () => {
    console.log('RESPONDING');
    return 'OK';
  });

  scala.channels.organization.request({ name: 'hi', device: {
    uuid: 'de710dcd-2e09-447d-9ae4-5050d73358c1'
  }}).then(p => {
    console.log('SUCCESS');
  }).catch(error => {
    console.log(error);
  });

});
