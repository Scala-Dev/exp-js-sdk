'use strict';


function generateTestThing () {
  return {
    name: Math.random().toString(),
    subtype: 'scala:thing:rfid',
    id: Math.random().toString()
  };
}

module.exports = suite => {

  describe('Things', () => {
    beforeEach(() => suite.exp.start(suite.credentials.device));


    it('Should resolve to null if uuid not specified', () => {
      return suite.exp.getThing().then(thing => { if (thing !== null) throw new Error(); });
    });

    it('Should resolve to null if uuid does not match existing thing.', () => {
      return suite.exp.getThing('fakeuuid').then(thing => { if (thing !== null ) throw new Error(); });
    });

    it('Should be able to create a new thing.', () => {
      return suite.exp.createThing(generateTestThing()).then(thing => {
        return suite.exp.getThing(thing.document.uuid);
      });
    });

    it('Should be able to get a list of things.', () => {
      return suite.exp.findThings().then(things => things.forEach(thing => {
        if (!(thing instanceof suite.exp._sdk.api.Thing)) throw new Error();
      }));
    });

    it('Should return empty list of things for unmatched query.', () => {
      return suite.exp.findThings({ name: 'tootallo' }).then(things => { if (things.length !== 0) throw new Error(); });
    });

     it('Should be able to fling.', () => {
      return suite.exp.findThings().then(things => {
        return things[0].fling({});
      });
    });

    it('Should be able to save changes to a thing.', () => {
      const name = Math.random().toString();
      return suite.exp.createThing(generateTestThing()).then(thing => {
        thing.document.name = name;
        return thing.save().then(() => suite.exp.getThing(thing.document.uuid)).then(thing => {
          if (thing.document.name !== name) throw new Error();
        });
      });
    });

    it('Should be able to listen for updates to thing.', done => {
      suite.exp.findThings().then(things => {
        return things[0].getChannel({ system: true }).listen('update', () => done()).then(() => {
          return things[0].save();
        });
      });
    });

    it('Should be able to communicate on thing channel.', done => {
      suite.exp.findThings().then(things => {
        return things[0].getChannel().listen('test', () => done()).then(() => {
          return things[0].getChannel().broadcast('test');
        });
      });
    });

    it('Should be able to refresh a thing in place.', () => {
      const name = Math.random().toString();
      return suite.exp.findThings().then(things => {
        return suite.exp.getThing(things[0].document.uuid).then(thing=> {
          thing.document.name = name;
          return thing.save().then(() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                things[0].refresh().then(() => {
                  if (things[0].document.name === name) resolve();
                }).catch(reject);
              }, 500);
            });
          });
        });
      });
    });


    describe('thing.getLocation()', () => {
      it('Should resolve to the thing\'s location.', () => {
        return suite.exp.createLocation().then(location => {
          const document = generateTestThing();
          document.location = location.document;
          return suite.exp.createThing(document).then(thing => {
            return thing.getLocation().then(location_ => {
              if (location.document.uuid !== location_.document.uuid) throw new Error();
            });
          });
        });
      });

      it('Should resolve to null when thing has no location.', () => {
        return suite.exp.createThing(generateTestThing()).then(thing => {
          return thing.getLocation().then(location => { if (location !== null) throw new Error(); });
        });
      });
    });

    describe('thing.getZones()', () => {
      it('Should resolve to the thing\'s zones.', () => {
        return suite.exp.createLocation({ zones: [{ key: '1', name: '1' }, { key: '2', name: '2' }, { key: '3', name: '3' }]}).then(location => {
          const document = generateTestThing();
          document.location = { uuid: location.document.uuid, zones: [{ key: '1' }]};
          return suite.exp.createThing(document).then(thing => {
            return thing.getZones().then(zones => {
              if (zones.length !== 1 || zones[0].document.name !== '1') throw new Error();
            });
          });
        });

      });
      it('Should resolve to an empty list if no zones match.', () => {
        return suite.exp.createLocation({ zones: [{ key: '1', name: '1' }, { key: '2', name: '2' }, { key: '3', name: '3' }]}).then(location => {
          const document = generateTestThing();
          document.location = { uuid: location.document.uuid, zones: [{ key: '32' }]};
          return suite.exp.createThing(document).then(thing => {
            return thing.getZones().then(zones => {
              if (zones.length !== 0) throw new Error();
            });
          });
        });
      });

      it('Should resolve to an empty list if no valid location is set.', () => {
        const document = generateTestThing();
        document.location = { uuid: 'teq', zones: [{ key: '32' }]};
        return suite.exp.createThing(document).then(thing => {
          return thing.getZones().then(zones => {
            if (zones.length !== 0) throw new Error();
          });
        });
      });
    });
  });
};