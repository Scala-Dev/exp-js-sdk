'use strict';


function generateTestLocation () {
  return {};
}

let exp;

module.exports = suite => {

  describe('Data', () => {
    beforeEach(() => exp = suite.startAsDevice());


    describe('exp.getData(group, key)', () => {

      it('Should return null if data doesnt exist.', () => {
        return exp.getData(Math.random().toString(), Math.random().toString()).then(data => { if (data !== null ) throw new Error(); });
      });

      it('Should retrieve existing data by key and group', () => {
        return exp.createData('group4', 'key1', { a: 1 }).then(() => {
          return exp.getData('group4', 'key1').then(data => {
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
        return exp.createData('group5', 'key7', { a: 1 }).then(() => {
          return exp.getData('group5', 'key7').then(data => {
            if (data.value.a !== 1) throw new Error();
          });
        });
      });

      it('Should be able to write to data twice.', () => {
        return exp.createData('group3', 'key5', {}).then(() => exp.createData('group3', 'key5', {}));
      });

    });

    describe('exp.deleteData(group, key)', () => {
      it('Should throw an error if group is not specified.', done => {
        try {
          return exp.deleteData();
        } catch (error) { return done(); }
      });

      it('Should throw an error if key is not specified.', done => {
        try {
          return exp.deleteData('group');
        } catch (error) { return done(); }
      });

      it('Should delete data with specified group and key.', () => {
        return exp.createData('group99', 'key99', { a: 1 })
          .then(() => exp.deleteData('group99', 'key99'))
          .then(() => exp.getData('group99', 'key99'))
          .then(data => {
            if (data !== null) throw new Error();
          });
      });
    });


    describe('exp.findData(params)', () => {
      it('Should retrieve an array of data', () => {
        return exp.findData().then(items => {
          if (!(items[0] instanceof exp._sdk.api.Data)) throw new Error();
        });
      });
    });


    describe('data.save()', () => {
      it('Should save change to value', () => {
        return exp.findData().then(items => {
          items[0].value = { b: 2 };
          return items[0].save().then(() => {
            return exp.getData(items[0].group, items[0].key).then(data => {
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
          return exp.createData(items[0].group, items[0].key, { e: 4 }).then(() => {
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

    describe('data.delete()', () => {
      it('Should resolve when data is deleted', () => {
        return exp.createData('group99', 'key99', { a:1 })
        .then(data => data.delete())
        .then(() => exp.getData('group99', 'key99'))
        .then(data => {
          if (data !== null) throw new Error();
        });
      });
    });
  });
};
