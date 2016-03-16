'use strict';

module.exports = (create, get, find) => {
  const name = Math.random().toString();
  const uuids = [];

  console.log(create());

  it('should be able to create with an empty object.', () => {
    return create();
  });

  it('should be able to create with a document.', () => {
    return create({});
  });

  it('should be able to create new and save.', () => {
    return create().then(resource => resource.save()).then(resource => uuids.push(resource.document.uuid));
  });

  it('should be able to create existing and save.', () => {
    return create({ uuid: uuids[0] }).then(resource => resource.save());
  });
};




