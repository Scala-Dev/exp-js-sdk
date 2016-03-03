# Getting Started

If you are using NPM add the JavaScript SDK to your node.js project as an NPM dependency, by adding the following to the `dependencies` section of your `package.json`
```
"exp-js-sdk": "git+https://github.com/scalainc/exp-js-sdk.git#develop",
```

For use in a node.js application v0.12.7 and npm@2.14.0 are recommended - see the [embedded boilerplate](https://github.com/ScalaInc/exp-embedded-boilerplate) project.

For use in a web app, browserify is recommended.

# Namespaces

The following namespaces are available in the EXP javascript SDK:
```exp.runtime``` starts and stops the SDK.
```exp.network``` facilitates communication on the EXP network.
```exp.api``` enables interaction with the API.


# Runtime

## exp.runtime.start(options)
Initialize the SDK and connect to EXP.

To start the sdk as a user:
```javascript
exp.runtime.start({
  username: "joe@joerocks.com",
  password: "123456",
  organization: "joerocks"
});

To start the sdk as a device:
```javascript
exp.runtime.start({
  deviceUuid: 'ee146ed3-437a-46cd-89e1-f91ce8bbb942', 
  secret: 'mashed potatoes' 
});
```

To start the sdk in a consumer app:
```javascript
exp.runtime.start({
  consumerAppUuid: 'ee146ed3-437a-46cd-89e1-f91ce8bbb942', 
  apiKey: 'abc123' 
});
```

To start the sdk using a valid token:
```javascript
exp.runtime.start({
  token: '6ed3...'
})
```

```
## exp.runtime.stop()
Disconnect and stop the SDK.


# Network

Each channel on the network is a named pathway for communication between devices. 


## channel = exp.network.getChannel(name)

Returns a channel object. Channel names are strings. 

```javascript
const channel = exp.network.getChannel('myChannel');
```

## channel.broadcast(name, payload)

Sends a broadcast message on the channel. Name is the name of the message and payload is any JSON serializable variable.

```javascript
channel.broadcast('hi', { myNameIs: 'slimLady' });
```

## listener = channel.listen(name, callback)

Sets a callback for broadcasts received on this channel. Returns a listener object.

```javascript
channel.listen('hi', payload => console.log(payload));
```

## listener.cancel()

Cancels the callback attached to the channel.


# API

## Devices

### exp.api.getDevice(uuid)
Returns a promise that resolves to a device.

### exp.api.findDevices(params)
Returns a query result based on given params.

### exp.api.createDevice(document, options)
Creates a new device given the specified document. Returns a promise that resolves to the new device. If options.save is false (default true), the device will not be saved.

### device.uuid
The uuid of the device.

### device.document
The underlying document.

### device.save()
Returns a promise that resolves when the device is saved.

### device.getExperience()
Returns a promise that resolves to the devices experience.

### device.getLocation()
Returns a promise that resolves to the devices location.






### exp.api.getDevice(uuid)
Returns a promise that resolves to a device

### resource.uuid
The uuid of the resource.

### resource.document
The underlying document. See the API documentation.

### resource.save()
Save the resource. Returns a promise.

## Getting Individual Resources

The following methods are available to retrive resources from the API. Each of them returns a promise that resolves to a resource object.

```exp.api.getDevice(uuid)```
```exp.api.getThing(uuid)```
```exp.api.getExperience(uuid)```
```exp.api.getLocation(uuid)```
```exp.api.getData(key)```
```exp.api.getContent(uuid)```



The params object are the query paramters passed to the HTTP request. See the API documentation for more details.

```exp.api.findDevices(params)```
```exp.api.findThings(params)```
```exp.api.findExperiences(params)```
```exp.api.findLocations(params)```
```exp.api.findData(params)```


## Creating Resources

Resources can be created using the following methods by passing in a javascript object that contains the underlying document.

```exp.api.createDevice(document)```
```exp.api.createThing(document)```
```exp.api.createExperience(document)```
```exp.api.createLocation(document)```
```exp.api.createData(key, value, document)```





## Data Resource
## Content Resource

### ```content.getUrl()``` 
Returns the absolute url to the content

## Device Resource

# Abstract API Objects


### ContentNode Object

##### content.uuid
The content's UUID.

##### content.getChildren()
Get the immediate children of this content node. Resolves to an array of [ContentNode Objects](#content-object).
```javascript
content.getChildren().then(children => {});
```

##### content.getUrl()
Get the absolute url to the content node data. Useful for image/video tags or to download a content file.
```javascript
const url = content.getUrl();
```

##### content.getVariantUrl(variantName)
Get the url to the content nodes variant data.
```javascript
const url = content.getVariantUrl('320.png');
```


### Device Object

##### device.uuid
The device's UUID

##### device.getExperience()
Get the device's experience. Resolves to an [Experience Object](#experience-object).
```javascript
device.getExperience().then(experience => {});
```

##### device.identify()
Request the device to identify itself. Resolve to the response from targeted device.
```javascript
device.identify().then(rsp => {});
```


### Thing Object

##### thing.uuid
The thing's UUID


### Experience Object

#### experience.uuid
The experience's UUID.

#### experience.raw
Temporary. The raw experience object.


### Location Object

##### location.uuid
The location's UUID.


### Data Object
#### data.key
The data item's key.

#### data.value
An arbitrary object that contains any data you want.

#### data.group
The data item's group.


# Sending Messages on the EXP Network

The EXP network facilitates real time messaging between devices within an organization.

## Channels

exp.getChannel(name, options)

```name``` is the name of the channel and ```options``` is 

options.system
options.consumer

## Broadcasting




# SDK Reference

  start (options) {
    if (this.constructor.started) return Promise.reject(new Error('Runtime already started.'));
    this.constructor.started = true;
    const defaults = { host: 'https://api.goexp.io', enableEvents: true };
    options = _.merge({}, defaults, options);
    if (options.type === 'user' || options.username || options.password || options.organization) {
      options.type = 'user';
      if (!options.username) return Promise.reject(new Error('Please specify the username.'));
      if (!options.password) return Promise.reject(new Error('Please specify the password.'));
      if (!options.organization) return Promise.reject(new Error('Please specify the organization.'));
    } else if (options.type === 'device' || options.secret) {
      options.type = 'device';
      if (!options.uuid && !options.allowPairing) return Promise.reject(new Error('Please specify the uuid.'));
      if (!options.secret && !options.allowPairing) return Promise.reject(new Error('Please specify the device secret.'));
    } else if (options.type === 'consumerApp' || options.apiKey) {
      options.type = 'consumerApp';
      if (!options.uuid) return Promise.reject(new Error('Please specify the uuid.'));
      if (!options.apiKey) return Promise.reject(new Error('Please specify the apiKey'));
    } else {
      return Promise.reject(new Error('Please specify authentication type.'));
    }
    if (options.enableEvents) network.start();
    return new Promise((resolve, reject) => {
      if (options.enableEvents) {
        network.start(options);
        network.on('online', resolve);
      } else {
        runtime.on('update', resolve);
      }
      runtime.on('error', reject);
      runtime.start(options);
    });
  }

  on (name, callback) { return this.constructor.events.on(name, callback, this.context); }
  getDelegate (context) { return new Sdk(context); }

  get (path, params) { return api.get(path, params); }
  post (path, params, body) { return api.post(path, params, body); }
  patch(path, params, body) { return api.patch(path, params, body); }
  put (path, params, body) { return api.put(path, params, body); }
  delete (path, params) { return api.post(path, params); }

  getDevice (uuid) { return resources.Device.get(uuid, this.context); }
  findDevices (params) { return resources.Device.find(params, this.context); }
  createDevice (document, options) { return resources.Device.create(document, options, this.context); }

  getThing (uuid) { return resources.Thing.get(uuid, this.context); }
  findThings (params) { return resources.Thing.find(params, this.context); }
  createThing (document, options) { return resources.Thing.create(document, options, this.context); }

  getExperience (uuid) { return resources.Experience.get(uuid,  this.context); }
  findExperiences (params) { return resources.Experience.find(params, this.context); }
  createExperience (document, options) { return resources.Experience.create(document, options, this.context); }

  getLocation (uuid) { return resources.Location.get(uuid, this.context); }
  findLocations (params) { return resources.Location.find(params, this.context); }
  createLocation (document, options) { return resources.Location.create(document, options, this.context); }

  getData (key, group) { return resources.Data.get(key, group, this.context); }
  findData (params) { return resources.Data.find(params, this.context); }
  createData (document, options) { return resources.Data.create(document, options, this.context); }

  getContent (uuid) { return resources.Content.get(uuid, this.context); }
  findContent (params) { return resources.Content.find(params, this.context); }

  getFeed (uuid) { return resources.Feed.get(uuid, this.context); }
  findFeeds (params) { return resources.Feed.find(params, this.context); }
  createFeed (document, options) { return resources.Feed.create(document, options, this.context); }


  get EventNode () { return EventNode; }


  get isConnected () { return network.isConnected; }

  get auth () { return runtime.auth; }

  getChannel (name, options) { return ChannelDelegate.create(name, options, this.context); }


}





# Communicating on the EXP Network

The EXP network facilitates real time communication between entities connected to EXP. A user or device can broadcast a JSON serializable payload to users and devices in your organization, and listeners to those broadcasts can respond to the broadcasters.

### Channels

All messages on the EXP network are sent over a channel. Channels have a name, and two flags: ```system``` and ```consumer```.

```javascript
const channel = exp.getChannel("my_channel", { system: false, consumer: false })
```
Set ```system``` to ```true``` to get a system channel. You cannot send messages on a system channels but can listen for system notifications, such as updates to API resources.

Set ```consumer``` to ```true``` to get a consumer channel. Consumer devices can only listen or broadcast on consumer channels. When ```consumer``` is ```false``` you will not receive consumer device broadcasts and consumer devices will not be able to hear your broadcasts.

Both ```system``` and ```consumer``` default to ```false```.


### Broadcasting

Use the broadcast method of a channel object to send a named message with a JSON serializable payload to other entities on the EXP network. You can optionally include a timeout to wait for responses to the broadcast. The call will return a promise that will resolve after the given timeout (or immediately). The promise will resolve to an array of the received JSON responses to the broadcast.

```javascript
exp.getChannel("myChannel").broadcast('Hello!', [1, 2, 3], 3000).then(function (responses) {
  console.log('I got a response!')
  console.log(responses);
});
```


### Listening

To listen for broadcasts, call the listen method of a channel object. 

```javascript
channel = exp.getChannel("myChannel").listen('Hello!', function (payload) {
  console.log('I received a broadcast!');
  console.log(payload);
});
```

The listen method takes a function as the second argument. When a broadcast is received, this function will be called with the broadcast payload as the first argument.




### Responding

To respond to broadcast add a second argument to the listener callback. The second argument is a method that can be invoked with a JSON serializable variable. Invoking this method will respond to the broadcast with the given data.


```javascript
channel = exp.getChannel("myChannel").listen('Hello!', function (payload, respond) {
  console.log('I\'m going to respond!');
  respond('I got your message!');
});
```


### Full Example

```javascript

var channel = exp.getChannel('myChannel');
channel.listen('get_random_number', function (payload, respond) {
  respond(Math.random());
});

channel.broadcast('get_random_number', null, 5000).then(function (numbers) {
  console.log('Here is a list of random numbers I got from others!');
  
});



```python

channel = exp.get_channel("my_channel")
listener = channel.listen(name="my_custom_event")

while True:
  broadcast = listener.wait(5)
  if broadcast and broadcast.payload is "hello!":
    print "Responding to broadcast."
    broadcast.respond("Nice to meet you!")

```






