'use strict';


module.exports = sdk => {
  describe('Sanity Tests', () => {
    it('Find devices should succeed.', () => sdk.findDevices());
    it('Find experience should succeed.', () => sdk.findExperiences());
    it('Find locations should succeed.', () => sdk.findLocations());
  });
};