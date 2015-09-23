const scala = require('../src/scala');

/* TEST R-R Pattern */
scala.init({
  host: 'http://api-develop.exp.scala.com',
  uuid: '8a2bef5b-5cba-4921-8b48-6be1e33fdb1f',
  secret: '5f76bdff73fb5f2441a925e53d90317940cca5e8615f33e835377e33cfd8c9b6cc446022aa4b46f8c08acdce26c7e5c6'
}).then(() => {
  // scala.channels.organization.respond({ name: 'hi' }, () => {
  //   console.log('RESPONDING');
  //   return 'OK';
  // });

  // scala.channels.organization.request({ name: 'hi', device: {
  //   uuid: 'de710dcd-2e09-447d-9ae4-5050d73358c1'
  // }}).then(p => {
  //   console.log('SUCCESS');
  // }).catch(error => {
  //   console.log(error);
  // });

  scala.api.getContentNode('root')
  .then(root => {
    console.log(JSON.stringify(root));
    root.getChildren()
    .then(children => {
      children.forEach(child => {
        child.getChildren()
        .then(grandchildren => {
          grandchildren.forEach(grandchild => {
            console.log(JSON.stringify(grandchild));
          })
        })
      })
    })
  });

});
