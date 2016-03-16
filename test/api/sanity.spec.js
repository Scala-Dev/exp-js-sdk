'use strict';


module.exports = sdk => {
  describe('Finding Resources', () => {
    it('Find devices should resolve to a list.', () => sdk.findDevices());
    it('Find experience should resolve to a list.', () => sdk.findExperiences());
    it('Find locations should resolve to a list.', () => sdk.findLocations());
    it('Find things should resolve to a list.', () => sdk.findThings());
    it('Find content should resolve to a list.', () => sdk.findThings());
    it('Find feeds should resolve to a list.', () => sdk.findFeeds());
    it('Find data should resolve to a list.', () => sdk.findData());
  });
  describe('Getting Resources', () => {

  });
  describe('Creating Resources', () => {

  });
};