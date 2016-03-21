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
        return exp.getExperience(experience.document.uuid);
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
        experience.document.name = name;
        return experience.save().then(() => exp.getExperience(experience.document.uuid)).then(experience => {
          if (experience.document.name !== name) throw new Error();
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

    it('Should be able to fling.', () => {
      return exp.findExperiences().then(experiences => {
        return experiences[0].fling({});
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
        return exp.getExperience(experiences[0].document.uuid).then(experience=> {
          experience.document.name = name;
          return experience.save().then(() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                experiences[0].refresh().then(() => {
                  if (experiences[0].document.name === name) resolve();
                }).catch(reject);
              }, 500);
            });
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
    });

  });

};