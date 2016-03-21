'use strict';

let exp;


function generateTestLocation () {
  return {
    zones: [{ key: '1', name: '1' }, { key: '2', name: '2' }]
  };
}


module.exports = suite => {

  describe('Zones', () => {
    beforeEach(() => exp = suite.startAsDevice());

    it('Should be able to get all devices in the zone.', () => {
      return exp.createLocation(generateTestLocation()).then(location => {
        return exp.createDevice({
          subtype: 'scala:device:server',
          location: {
            uuid: location.document.uuid,
            zones: [{ key: '1' }]
          }
        }).then(() => {
          return location.getZones().then(zones => {
            const zone = zones.find(zone => zone.document.key == '1');
            return zone.getDevices().then(devices => {
              if (devices.length !== 1) throw new Error();
            });
          });
        });
      });
    });

    it('Should be able to get things in the zone.', () => {
      return exp.createLocation(generateTestLocation()).then(location => {
        return exp.createThing({
          subtype: 'scala:thing:rfid',
          id: 'test',
          location: {
            uuid: location.document.uuid,
            zones: [{ key: '1' }]
          }
        }).then(() => {
          return location.getZones().then(zones => {
            const zone = zones.find(zone => zone.document.key == '1');
            return zone.getThings().then(things => {
              if (things.length !== 1) throw new Error();
            });
          });
        });
      });
    });


     it('Should be able to fling.', () => {
      return exp.createLocation(generateTestLocation()).then(location => {
        return location.getZones().then(zones => {
          zones.forEach(zone => zone.fling({}))
        });
      });
    });

    it('Should be able to save changes to a zone.', () => {
      return exp.createLocation(generateTestLocation()).then(location => {
        return location.getZones().then(zones => {
          zones[0].document.name = 'foomanchu';
          return zones[0].save().then(() => {
            return location.getZones().then(zones => {
              if (zones[0].document.name !== 'foomanchu') throw new Error();
            });
          });
        });
      });
    });

    it('Should be able to communicate on zone channel.', () => {
     return exp.createLocation(generateTestLocation()).then(location => {
        return location.getZones().then(zones => {
          zones[0].getChannel('hi').broadcast({});
        });
      });
    });

    it('Should be able to refresh a zone in place.', () => {
      return exp.createLocation(generateTestLocation()).then(location => {
        return exp.getLocation(location.document.uuid).then(location_ => {
          location_.document.zones[0].name = 'test2';
          return location_.save().then(() => {
            return location.getZones().then(zones => {
              return zones[0].refresh().then(() => {
                if (zones[0].document.name !== 'test2') throw new Error();
              })
            });
          });
        });
      });
    });
  });
};