'use strict';


function generateTestFeed () {
  return {
    subtype: 'scala:feed:weather',
    searchValue: '19713',
    name: Math.random().toString()
  };
}

let exp;

module.exports = suite => {

  describe('Feeds', () => {
    beforeEach(() => exp = suite.startAsDevice());


    it('Should resolve to null if uuid not specified', () => {
      return exp.getFeed().then(feed => { if (feed !== null) throw new Error(); });
    });

    it('Should resolve to null if uuid does not match existing feed.', () => {
      return exp.getFeed('fakeuuid').then(feed => { if (feed !== null ) throw new Error(); });
    });

    it('Should be able to create a new location.', () => {
      return exp.createFeed(generateTestFeed()).then(feed => {
        return exp.getFeed(feed.document.uuid);
      });
    });

    it('Should be able to get a list of feeds.', () => {
      return exp.findFeeds().then(feeds => feeds.forEach(feed => {
        if (!(feed instanceof exp._sdk.api.Feed)) throw new Error();
      }));
    });

    it('Should return empty list of feeds for unmatched query.', () => {
      return exp.findFeeds({ name: 'tootallo' }).then(feeds => { if (feeds.length !== 0) throw new Error(); });
    });

    it('Should be able to fling.', () => {
      return exp.findFeeds().then(feeds => {
        return feeds[0].fling({});
      });
    });

    it('Should be able to save changes to a feed.', () => {
      const name = Math.random().toString();
      return exp.createFeed(generateTestFeed()).then(feed => {
        feed.document.name = name;
        return feed.save().then(() => exp.getFeed(feed.document.uuid)).then(feed => {
          if (feed.document.name !== name) throw new Error();
        });
      });
    });

    it('Should be able to listen for updates to a feed.', done => {
      exp.findFeeds().then(feeds => {
        return feeds[0].getChannel({ system: true }).listen('update', () => done()).then(() => {
          return feeds[0].save();
        });
      });
    });

    it.skip('Should be able to communicate on location channel.', done => {
      exp.findLocations().then(locations => {
        return locations[0].getChannel().listen('test', () => done()).then(() => {
          return locations[0].getChannel().broadcast('test');
        });
      });
    });

    it.skip('Should be able to refresh a location in place.', () => {
      const name = Math.random().toString();
      return exp.findLocations().then(locations => {
        return exp.getLocation(locations[0].document.uuid).then(location=> {
          location.document.name = name;
          return location.save().then(() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                locations[0].refresh().then(() => {
                  if (locations[0].document.name === name) resolve();
                }).catch(reject);
              }, 500);
            });
          });
        });
      });
    });

    describe('location.getLayoutUrl()', () => {
      it.skip('Should return a layout url', () => {
        return exp.createLocation().then(location => {
          return location.getLayoutUrl();
        });
      });
    });

    describe('location.getDevices()', () => {
      it.skip('Should return all devices in location.', () => {
        return exp.createLocation().then(location => {
          return exp.createDevice({ subtype: 'scala:device:server' }).then(device => {
            device.document.location = { uuid: location.document.uuid };
            return device.save().then(() => {
              return location.getDevices().then(devices => {
                if (devices.length !== 1) throw new Error();
              });
            });
          });
        });
      });
    });
    describe('location.getThings()', () => {

      it.skip('Should return all things in location.', () => {
        return exp.createLocation().then(location => {
          return exp.createThing({ subtype: 'scala:thing:rfid', id: 'test23' }).then(thing => {
            thing.document.location = { uuid: location.document.uuid };
            return thing.save().then(() => {
              return location.getThings().then(things => {
                if (things.length !== 1) throw new Error();
              });
            });
          });
        });
      });
    });

    describe('location.getZones()', () => {
      it.skip('Should resolve to an array of zones.', () => {
        const document = generateTestLocation();
        document.zones = [{ key: '1', name: '1'}, { key: '2', name: '2' }];
        return exp.createLocation(document).then(location => {
          return location.getZones().then(zones => {
            if (zones.length !== 2) throw new Error();
            if (!(zones[0] instanceof exp._sdk.api.Zone)) throw new Error();
          });
        });
      });
    });
  });
};