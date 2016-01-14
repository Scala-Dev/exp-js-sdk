'use strict';


// This is what the sdk looks like.


class Delegate {

  constructor (sdk, context) {
    this.sdk = sdk;
    this.context = context;
  }

  on (name, callback) {
    this.sdk.events.on(name, callback, this._context);
  }


  start (options) { return this.sdk.runtime.start(options); }
  stop () { return this.sdk.runtime.stop(); }
  get online () { return this.network.status; }


  getChannel (name) {

  }


  getDelegate (context) {
    return new Delegate(this.sdk, context);
  }


  get () {}
  patch () {}
  post () {}
  put () {}
  delete () {}


  getContent () {}
  findContent () {}

  getExperience () {}
  findExperiences () {}
  createExperience () {}




}