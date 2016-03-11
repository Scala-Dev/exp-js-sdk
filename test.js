'use strict';


const exp = require('./index.js');
exp.on('online', () => console.log('ONLINE'));
exp.on('offline', () => console.log('OFFLINE'));

exp.start({
  host: 'http://localhost:9000',
  "uuid":"5b85d7ff-5664-41cf-929a-9e68930976fc",
  "secret":"b2a6744ea71777e7521f7312472548a622cfe29c6c49b001ef50c913fb0c7c8d6c74d2ef0173e953368b82718d9a2cb9", type: 'device' }).then(() => {

  exp.getChannel('test').listen('test', () => {});
}).catch(error => {
  console.log(error);
  process.exit(1);
});

setInterval(() => console.log('RUNNING'), 10000);

