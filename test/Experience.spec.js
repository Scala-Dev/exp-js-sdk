'use strict';


function generateTestExperience () {
  return {};
}

let exp;

module.exports = suite => {

  describe('Experiences', () => {
    beforeEach(() => exp = suite.startAsDevice());


    it('Should resolve to null if uuid not specified', () => {
      return exp.getExperience().then(experience => { if (experience !== null) throw new Error(); });
    });

    it('Should resolve to null if uuid does not match existing experience.', () => {
      return exp.getExperience('fakeuuid').then(experience => { if (experience !== null ) throw new Error(); });
    });

    it('Should be able to create a new experience.', () => {
      return exp.createExperience(generateTestExperience()).then(experience => {
        return exp.getExperience(experience.uuid);
      });
    });

    it('Should be able to get a list of experiences.', () => {
      return exp.createExperience({}).then(() => {
        return exp.findExperiences().then(experiences => {
          if (experiences.length < 1) throw new Error();
          experiences.forEach(experience => {
            if (!(experience instanceof exp._sdk.api.Experience)) throw new Error();
          });
        });
      });
    });

    it('should have total number of experiences', () => {
      return exp.createExperience({}).then(() => {
        return exp.createExperience({}).then(() => {
          return exp.findExperiences({ limit: 1 }).then(experiences => {
            if (experiences.length !== 1) throw new Error();
            if (!experiences.total || experiences.total <= 1) throw new Error();
          });
        });
      });
    });


    it('Should be able to get a list of experiences.', () => {
      return exp.findExperiences().then(experiences => experiences.forEach(experience => {
        if (!(experience instanceof exp._sdk.api.Experience)) throw new Error();
      }));
    });


    it('Should return empty list of experiences for unmatched query.', () => {
      return exp.findExperiences({ name: 'tootallo' }).then(experiences => { if (experiences.length !== 0) throw new Error(); });
    });

    it('Should be able to save changes to a experience.', () => {
      const name = Math.random().toString();
      return exp.createExperience(generateTestExperience()).then(experience => {
        experience.name = name;
        return experience.save().then(() => exp.getExperience(experience.uuid)).then(experience => {
          if (experience.name !== name) throw new Error();
        });
      });
    });

    it('Should be able to listen for updates to experience.', done => {
      exp.findExperiences().then(experiences => {
        return experiences[0].getChannel({ system: true }).listen('update', () => done()).then(() => {
          return experiences[0].save();
        });
      });
    });


    it('Should be able to communicate on experience channel.', done => {
      exp.findExperiences().then(experiences => {
        return experiences[0].getChannel().listen('test', () => done()).then(() => {
          return experiences[0].getChannel().broadcast('test');
        });
      });
    });

    it('Should be able to refresh a experience in place.', () => {
      const name = Math.random().toString();
      return exp.findExperiences().then(experiences => {
        return exp.getExperience(experiences[0].uuid).then(experience=> {
          experience.name = name;
          return experience.save().then(() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                experiences[0].refresh().then(() => {
                  if (experiences[0].name === name) resolve();
                }).catch(reject);
              }, 500);
            });
          });
        });
      });
    });

    describe('exp.getCurrentExperience()', () => {
      describe('when device has an experience', () => {
        const name = Math.random().toString();
        beforeEach(() => {
          return exp.getCurrentDevice().then(device => {
            return exp.createExperience({ name: name }).then(experience => {
              device.document.experience = experience.document;
              return device.save();
            });
          });
        });
        afterEach(() => {
          return exp.getCurrentDevice().then(device => {
            device.document.experience.uuid = null;
            return device.save();
          });
        });

        it('should resolve to the current experience', () => {
          return exp.getCurrentExperience().then(experience => {
            if (experience.name !== name) throw new Error();
          });
        });
      });

      describe('when device has no experience', () => {
        beforeEach(() => {
          return exp.getCurrentDevice().then(device => {
            device.document.experience = {};
            device.document.experience.uuid = null;
            return device.save();
          });
        });
        it('should resolve to null', () => {
          return exp.getCurrentExperience().then(experience => {
            if (experience !== null) throw new Error();
          });
        });
      });

      describe('when not a device', () => {
        const exp = suite.startAsUser();
        it('should resolve to null', () => {
          return exp.getCurrentExperience().then(experience => {
            if (experience !== null) throw new Error();
          });
        });
      });


    });


    describe('experience.getDevices()', () => {
      it('Should return a list of devices in the experience.', () => {
        return exp.createExperience({}).then(experience => {
          return exp.createDevice({ subtype: 'scala:device:server', experience: { uuid: experience.document.uuid } }).then(() => {
            return experience.getDevices().then(devices => {
              if (devices.length !== 1) throw new Error();
            });
          });
        });
      });

      it('Return value should have field "total" which is the number of devices in list.', () => {
        return exp.createExperience({}).then(experience => {
          return exp.createDevice({ subtype: 'scala:device:server', experience: { uuid: experience.document.uuid } }).then(() => {
            return exp.createDevice({ subtype: 'scala:device:server', experience: { uuid: experience.document.uuid } }).then(() => {
              return experience.getDevices({ limit: 1 }).then(devices => {
                if (devices.length !== 1) throw new Error();
                if (devices.total !== 2) throw new Error();
              });
            });
          });
        });
      });

    });

  });

};
