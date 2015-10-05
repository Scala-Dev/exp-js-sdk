const scala = require('../src/scala');

scala.runtime.start({
  username: 'email@email.com',
  host: 'http://localhost:9000',
  organization: 'scala'
}).then(() => {
  scala.api.getData('2', 'cats').then(data => {
    console.log(data);
  });
  scala.api.findData({ group: 'cats2' }).then(results => {
    console.log(results);
  });
});
