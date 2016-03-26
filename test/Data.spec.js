'use strict';


function generateTestLocation () {
  return {};
}

let exp;

module.exports = suite => {

  describe('Data', () => {
    beforeEach(() => exp = suite.startAsDevice());


    describe('exp.getData(key, group)', () => {
      it('Value should be null if key not specified', () => {
        return exp.getData().then(data => { if (data.value !== null) throw new Error(); });
      });


      it('Value should be null if key does not match existing data.', () => {
        return exp.getData('fakeuuid').then(data => { if (data.value !== null ) throw new Error(); });
      });

      it('Should retrieve existing data by key and group', () => {
        return exp.createData('testkey4', 'testgroup1', { a: 1 }).then(() => {
          return exp.getData('testkey4', 'testgroup1').then(data => {
            if (data.value.a !== 1) throw new Error();
          });
        });
      });

       it('Should retrieve existing data by key', () => {
        return exp.createData('testkey5', 'default', { a: 1 }).then(() => {
          return exp.getData('testkey5').then(data => {
            if (data.value.a !== 1) throw new Error();
          });
        });
      });
    });

    describe('exp.createData(key, group, value)', () => {

      it('Should throw an error if key is not specified.', done => {
        try {
          return exp.createData();
        } catch (error) { return done(); }
      });

      it('Should create data with specified key, value, and group.', () => {
        return exp.createData('testkey1', 'testgroup1', { a: 1 }).then(() => {
          return exp.getData('testkey1', 'testgroup1').then(data => {
            if (data.value.a !== 1) throw new Error();
          });
        });
      });

      it('Should create data into default group.', () => {
        return exp.createData('testkey2', { a: 1 }).then(data => {
          return exp.getData('testkey2').then(data => {
            if (data.value.a !== 1) throw new Error();
          });
        });
      });

      it('Should be able to write to data twice.', () => {
        return exp.createData('testkey3', {}).then(() => exp.createData('testkey3', {}));
      });

    });

    describe('exp.findData(params)', () => {
      it('Should retrieve an array of data', () => {
        return exp.findData().then(items => {
          if (!(items[0] instanceof exp._sdk.api.Data)) throw new Error();
        });
      });
    });

    describe('data.fling()', () => {
      it('Should succeed', () => {
        return exp.findData().then(items => {
          return items[0].fling({});
        });
      });
    });

    describe('data.save()', () => {
      it('Should save change to value', () => {
        return exp.findData().then(items => {
          items[0].value = { b: 2 };
          return items[0].save().then(() => {
            return exp.getData(items[0].document.key, items[0].document.group).then(data => {
              if (data.value.b !== 2) throw new Error();
            });
          });
        });
      });
    });

    describe('data.value', () => {
      it('Should return the data value.', () => {
        return exp.createData('testkey12', 'testGroup231', {c: 1}).then(data => {
          if (data.value.c !== 1) throw new Error();
        });
      });
      it('Should set the data value.', () => {
        return exp.findData().then(items => {
          items[0].value = { d: 1 };
          if (items[0].value.d !== 1) throw new Error();
        });
      });
    });

    describe('data.refresh()', () => {
      it('Should update value', () => {
        return exp.findData().then(items => {
          return exp.createData(items[0].document.key, items[0].document.group, { e: 4 }).then(() => {
            return items[0].refresh().then(() => {
              if (items[0].value.e !== 4) throw new Error();
            });
          });
        });
      });
    });

    describe('data.getChannel()', () => {
      it('Should be able to communicate on data channel.', done => {
        return exp.findData().then(items => {
          return items[0].getChannel().listen('test', () => done()).then(() => {
            return items[0].getChannel().broadcast('test');
          });
        });
      });

    });

  });
};