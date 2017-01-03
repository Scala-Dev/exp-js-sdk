'use strict';


function generateTestLocation () {
  return {};
}

let exp;

module.exports = suite => {

  describe('Locations', () => {
    beforeEach(() => exp = suite.startAsDevice());

    it('Should resolve to null if uuid not specified', () => {
      return exp.getLocation().then(location => { if (location !== null) throw new Error(); });
    });

    it('Should resolve to null if uuid does not match existing location.', () => {
      return exp.getLocation('fakeuuid').then(location => { if (location !== null ) throw new Error(); });
    });

    it('Should be able to create a new location.', () => {
      return exp.createLocation(generateTestLocation()).then(location => {
        return exp.getLocation(location.document.uuid);
      });
    });

    it('Should be able to delete a location.', () => {
      return exp.createLocation(generateTestLocation()).then(location => {
        return exp.deleteLocation(location.document.uuid)
          .then(() => exp.getLocation(location.document.uuid))
          .then(location => {
            if (location !== null) throw new Error();
          });
      });
    });

    it('Should be able to get a list of locations.', () => {
      return exp.findLocations().then(locations => locations.forEach(location => {
        if (!(location instanceof exp._sdk.api.Location)) throw new Error();
      }));
    });

    it('Should return empty list of locations for unmatched query.', () => {
      return exp.findLocations({ name: 'tootallo' }).then(locations => { if (locations.length !== 0) throw new Error(); });
    });

    it('Should be able to save changes to a location.', () => {
      const name = Math.random().toString();
      return exp.createLocation(generateTestLocation()).then(location => {
        location.document.name = name;
        return location.save().then(() => exp.getLocation(location.document.uuid)).then(location => {
          if (location.document.name !== name) throw new Error();
        });
      });
    });

    it('Should be able to listen for updates to location.', done => {
      exp.findLocations().then(locations => {
        return locations[0].getChannel({ system: true }).listen('update', () => done()).then(() => {
          return locations[0].save();
        });
      });
    });

    it('Should be able to communicate on location channel.', done => {
      exp.findLocations().then(locations => {
        return locations[0].getChannel().listen('test', () => done()).then(() => {
          return locations[0].getChannel().broadcast('test');
        });
      });
    });

    it('Should be able to refresh a location in place.', () => {
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
      it('Should return a layout url', () => {
        return exp.createLocation().then(location => {
          return location.getLayoutUrl();
        });
      });
    });

    describe('location.getDevices()', () => {
      it('Should return all devices in location.', () => {
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

      it('Return value should have field "total" which is the number of devices in list.', () => {
        return exp.createLocation().then(location => {
          return exp.createDevice({ subtype: 'scala:device:server' }).then(device => {
            device.document.location = { uuid: location.document.uuid };
            return device.save().then(() => {
              return location.getDevices({ limit: 0 }).then(devices => {
                if (devices.length !== 0) throw new Error();
                if (devices.total !== 1) throw new Error();
              });
            });
          });
        });
      });

    });

    describe('exp.getCurrentLocation()', () => {
      describe('when device has an location', () => {
        const name = Math.random().toString();
        beforeEach(() => {
          return exp.getCurrentDevice().then(device => {
            return exp.createLocation({ name: name }).then(location => {
              device.document.location = location.document;
              return device.save();
            });
          });
        });
        afterEach(() => {
          return exp.getCurrentDevice().then(device => {
            device.document.location.uuid = null;
            return device.save();
          });
        });

        it('should resolve to the current location', () => {
          return exp.getCurrentLocation().then(location => {
            if (location.name !== name) throw new Error();
          });
        });
      });

      describe('when device has no location', () => {
        beforeEach(() => {
          return exp.getCurrentDevice().then(device => {
            device.document.location = {};
            device.document.location.uuid = null;
            return device.save();
          });
        });
        it('should resolve to null', () => {
          return exp.getCurrentLocation().then(location => {
            if (location !== null) throw new Error();
          });
        });
      });

      describe('when not a device', () => {
        const exp = suite.startAsUser();
        it('should resolve to null', () => {
          return exp.getCurrentLocation().then(location => {
            if (location !== null) throw new Error();
          });
        });
      });


    });

    describe('location.getThings()', () => {
      it('Return value should have field "total" which is the number of things in list.', () => {
        return exp.createLocation().then(location => {
          return exp.createThing({ subtype: 'scala:thing:rfid', id: 'test23' }).then(thing => {
            thing.document.location = { uuid: location.document.uuid };
            return thing.save().then(() => {
              return location.getThings({ limit: 0 }).then(things => {
                if (things.length !== 0) throw new Error();
                if (things.total !== 1) throw new Error();
              });
            });
          });
        });
      });

      it('Should return all things in location.', () => {
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
      it('Return value should have field "total" which is number of zones', () => {
        const document = generateTestLocation();
        document.zones = [{ key: '1', name: '1'}, { key: '2', name: '2' }];
        return exp.createLocation(document).then(location => {
          return location.getZones().then(zones => {
            if (zones.total !== 2) throw new Error();
          });
        });
      });

      it('should resolve to an empty array with total of 0 if no zones is assigned', () => {
        const document = generateTestLocation();
        document.zones = [];
        return exp.createLocation(document).then(location => {
          return location.getZones().then(zones => {
            if (zones.total !== 0) throw new Error();
            if (zones.length !== 0) throw new Error();
          });
        });
      });

      it('Should resolve to an array of zones.', () => {
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

    describe('location.delete()', () => {
      it('Should resolve when location is deleted', () => {
        return exp.createLocation({}).then(location => {
          return location.delete().then(() => {
            return exp.getLocation(location.uuid).then(location => {
              if (location !== null) throw new Error();
            });
          });
        });
      });
    });
  });
};
