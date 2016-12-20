'use strict';

let exp;

module.exports = suite => {

  describe('Content', () => {
    beforeEach(() => exp = suite.startAsDevice());

    it('Should be able to find files.', () => {
      return exp.findContent({ limit: 20 }).then(items => {
        if (items.length === 0) throw new Error('Please seed the JCR with some content.');
      });
    });

    // this is broken due to the exp-jcr bug, EXP-2062
    // it('Return value should have field "total" which is number of items', () => {
    //   return exp.findContent().then(items => {
    //     if (items.length !== items.total) throw new Error();
    //   });
    // });

    it('should be able to filter children', () => {
      let ok = false;
      return exp.findContent({ subtype: 'scala:content:folder', limit: 20  }).then(items => {
        return Promise.all(items.map(item => {
          return item.getChildren({ subtype: 'scala:content:folder' }).then(folders => {
            folders.forEach(folder => {
              if (folder.document.subtype === 'scala:content:folder') {
                ok = true;
              } else {
                throw new Error();
              }
            });
          });
        })).then(() => {
          if (!ok) throw new Error('Need folder inside of folder for test.');
        });
      });
    });

    it('Should be able to get content by uuid.', () => {
      return exp.findContent({ limit: 20 }).then(items => {
        return exp.getContent(items[0].document.uuid).then(content => {
          if (!(content instanceof exp._sdk.api.Content)) throw new Error();
        });
      });
    });

    it('Should be able to get children.', () => {
      // eek
      let ok = false;
      return exp.findContent({ subtype: 'scala:content:folder', limit: 20  }).then(items => {
        return Promise.all(items.map(item => {
          if (ok) return;
          if (item.document.subtype === 'scala:content:folder') {
            return item.getChildren().then(children => {
              if (ok) return;
              return Promise.all(children.map(child => {
                if (ok) return;
                if (child.document.subtype === 'scala:content:folder') {
                  return child.getChildren().then(() => { ok = true; return true; });
                }
              }));
            });
          }
        })).then(results => {
          let total = 0;
          results.forEach(result => {
            if (result) result.forEach(result => { if (result) total += 1; });
          });
          if (total === 0) throw new Error('Please include a folder in your JCR.');
        });
      });
    });

    describe('content.getUrl()', () => {
      it('Should be able to get url of files.', done => {
        exp.findContent({ subtype: 'scala:content:file', limit: 20  }).then(items => {
          items.some(item => {
            if (item.document.subtype === 'scala:content:file') {
              if (!item.getUrl()) done(new Error());
              done();
              return true;
            }
          });
        });
      });

      it('Should be able to get url of urls!.', done => {
        exp.findContent({ subtype: 'scala:content:url', limit: 20  }).then(items => {
          items.some(item => {
            if (item.document.subtype === 'scala:content:url') {
              if (!item.getUrl()) done(new Error());
              done();
              return true;
            }
          });
        });
      });

      it('Should be able to get url of apps!.', () => {
        return exp.findContent({ subtype: 'scala:content:app', limit: 20  }).then(items => {
          const item = items.find(item => item.subtype === 'scala:content:app');
          if (!item) throw new Error('Please add an app to root.');
          const url = item.getUrl();
          if (!url) throw new Error();
        });
      });
    });


    describe('content.getVariantUrl(name)', () => {
      it('Should return variant url if a variant exists.', () => {
        return exp.findContent({ limit: 20 }).then(items => {
          const item = items.find(item => item.document.variants && item.document.variants.length > 0);
          if (!item) throw new Error('Please add content to root with variants.');
          const url = item.getVariantUrl(item.document.variants[0].name);
          if (!url) throw new Error();
        });
      });
    });

    describe('content.hasVariant(name)', () => {
      it('Should return true if variant exists.', () => {
        return exp.findContent({ limit: 20 }).then(items => {
          const item = items.find(item => item.document.variants && item.document.variants.length > 0);
          if (!item) throw new Error('Please add content to root with variants.');
          if (!item.hasVariant(item.document.variants[0].name)) throw new Error();
        });
      });
      it('Should return false if variant does not exist', () => {
        return exp.findContent({ limit: 20 }).then(items => {
          const item = items.find(item => item.document.variants && item.document.variants.length > 0);
          if (!item) throw new Error('Please add content to root with variants.');
          if (item.hasVariant('test')) throw new Error();
        });
      });
       it('Should return false if content has no variants', () => {
        return exp.findContent({ limit: 20 }).then(items => {
          const item = items.find(item => !item.document.variants);
          if (!item) throw new Error('Please add content to root with variants.');
          if (item.hasVariant('test')) throw new Error();
        });
      });
    });



    it('Should resolve to null if uuid not specified', () => {
      return exp.getContent().then(content => { if (content !== null) throw new Error(); });
    });

    it('Should resolve to null if uuid does not match existing content.', () => {
      return exp.getContent('fakeuuid').then(content => { if (content !== null ) throw new Error(); });
    });



    it('Should be able to communicate on content channel.', done => {
      exp.findContent({ limit: 20 }).then(items => {
        return items[0].getChannel().listen('test', () => done()).then(() => {
          return items[0].getChannel().broadcast('test');
        });
      });
    });

    it('Should expose subtype field.', () => {
      return exp.findContent({ limit: 20 }).then(items => {
        if (!items[0].subtype) throw new Error();
      });
    });

  });
};
