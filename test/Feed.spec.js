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

    it('Should be able to communicate on feed channel.', done => {
      exp.findFeeds().then(feeds => {
        return feeds[0].getChannel().listen('test', () => done()).then(() => {
          return feeds[0].getChannel().broadcast('test');
        });
      });
    });

    it('Should be able to refresh a feed in place.', () => {
      const name = Math.random().toString();
      return exp.findFeeds().then(feeds => {
        return exp.getFeed(feeds[0].document.uuid).then(feed=> {
          feed.document.name = name;
          return feed.save().then(() => {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                feeds[0].refresh().then(() => {
                  if (feeds[0].document.name === name) resolve();
                }).catch(reject);
              }, 500);
            });
          });
        });
      });
    });

    it('Should be able to get data.', () => {
      return exp.createFeed(generateTestFeed()).then(feed => {
        return feed.getData().then(data => {
          if (!data) throw new Error();
        });
      });
    });
  });
};