'use strict';

let exp;
module.exports = suite => {

  describe('Devices', () => {
    beforeEach(() => exp = suite.startAsDevice());

    it('Should be able to get existing device.', () => {
      return exp.getDevice(suite.credentials.device.uuid).then(device => {
        if (!(device instanceof exp._sdk.api.Device)) throw new Error();
      });
    });

    it('Should resolve to null if uuid not specified', () => {
      return exp.getDevice().then(device => { if (device !== null) throw new Error(); });
    });

    it('Should resolve to null if uuid does not match existing device.', () => {
      return exp.getDevice('fakeuuid').then(device => { if (device !== null ) throw new Error(); });
    });

    it('Should be able to get a list of devices.', () => {
      return exp.findDevices().then(devices => devices.forEach(device => {
        if (!(device instanceof exp._sdk.api.Device)) throw new Error();
      }));
    });

    it('Should return empty list of devices for unmatched query.', () => {
      return exp.findDevices({ name: 'tootallo' }).then(devices => { if (devices.length !== 0) throw new Error(); });
    });

    it('Should be able to create a new device.', () => {
      return exp.createDevice({ subtype: 'scala:device:server', name: Math.random().toString() }).then(device => {
        return exp.getDevice(device.document.uuid);
      });
    });

    it('Should be able to fling.', () => {
      return exp.findDevices().then(devices => {
        return devices[0].fling({});
      });
    });

    it('Should be able to save changes to a device.', () => {
      const name = Math.random().toString();
      return exp.createDevice({ subtype: 'scala:device:player' }).then(device => {
        device.document.name = name;
        return device.save().then(() => exp.getDevice(device.document.uuid)).then(device => {
          if (device.document.name !== name) throw new Error();
        });
      });
    });

    it('Should be able to listen for updates to device.', done => {
      exp.findDevices().then(devices => {
        return devices[0].getChannel({ system: true }).listen('update', () => done()).then(() => {
          return devices[0].save();
        });
      });
    });

    it('Should be able to communicate on device channel.', done => {
      exp.findDevices().then(devices => {
        return devices[0].getChannel().listen('test', () => done()).then(() => {
          return devices[0].getChannel().broadcast('test');
        });
      });
    });

    it('Should be able to refresh a device in place.', done => {
      const name = Math.random().toString();
      exp.findDevices().then(devices => {
        exp.getDevice(devices[0].document.uuid).then(device => {
          device.document.name = name;
          device.save().then(() => {
            setTimeout(() => {
              devices[0].refresh().then(() => {
                if (devices[0].document.name === name) done();
              });
            }, 500);
          });
        });
      });
    });

    describe('device.getExperience()', () => {
      it('Should resolve to the device\'s experience.', done => {
        exp.createExperience().then(experience => {
          exp.createDevice({ subtype: 'scala:device:server', experience: experience.document }).then(device => {
            device.getExperience().then(experience_ => {
              if (experience.document.uuid === experience_.document.uuid) done();
            });
          });
        });
      });
      it('Should resolve to null when the device has no experience.', () => {
        return exp.createDevice({ subtype: 'scala:device:server' }).then(device => {
          return device.getExperience().then(experience => { if (experience !== null) throw new Error(); });
        });
      });
    });

    describe('device.getLocation()', () => {
      it('Should resolve to the device\'s location.', () => {
        return exp.createLocation().then(location => {
          return exp.createDevice({ subtype: 'scala:device:server', location: location.document }).then(device => {
            return device.getLocation().then(location_ => {
              if (location.document.uuid !== location_.document.uuid) throw new Error();
            });
          });
        });
      });

      it('Should resolve to null when device has no location.', () => {
        return exp.createDevice({ subtype: 'scala:device:server' }).then(device => {
          return device.getLocation().then(location => { if (location !== null) throw new Error(); });
        });
      });
    });

    describe('device.getZones()', () => {
      it('Should resolve to the device\'s zones.', () => {
        return exp.createLocation({ zones: [{ key: '1', name: '1' }, { key: '2', name: '2' }, { key: '3', name: '3' }]}).then(location => {
          return exp.createDevice({ subtype: 'scala:device:server', location: { uuid: location.document.uuid, zones: [{ key: '1'}]} }).then(device => {
            return device.getZones().then(zones => {
              if (zones.length !== 1 || zones[0].document.name !== '1') throw new Error();
            });
          });
        });

      });
      it('Should resolve to an empty list if no zones match.', () => {
        return exp.createLocation({ zones: [{ key: '1', name: '1' }, { key: '2', name: '2' }, { key: '3', name: '3' }]}).then(location => {
          return exp.createDevice({ subtype: 'scala:device:server', location: { uuid: location.document.uuid, zones: [{ key: '31'}]} }).then(device => {
            return device.getZones().then(zones => {
              if (zones.length !== 0) throw new Error();
            });
          });
        });
      });

      it('Should resolve to an empty list if no location is set.', () => {
        return exp.createDevice({ subtype: 'scala:device:server', location: { uuid: 'poo', zones: [{ key: '1'}]} }).then(device => {
          return device.getZones().then(zones => {
            if (zones.length !== 0) throw new Error();
          });
        });
      });
    });
  });
};