# Getting Started

If you are using NPM add the JavaScript SDK to your node.js project as an NPM dependency, by adding the following to the `dependencies` section of your `package.json`
```
"exp-js-sdk": "git+https://github.com/scalainc/exp-js-sdk.git#develop",
```

Or to use a specific release:
```
"exp-js-sdk": "git+https://github.com/scalainc/exp-js-sdk.git#v0.0.1",
```

For use in a node.js application v0.12.7 and npm@2.14.0 are recommended - see the [embedded boilerplate](https://github.com/ScalaInc/exp-embedded-boilerplate) project.

For use in a web app, browserify is recommended.

# exp.runtime

## exp.runtime.start(options)
Initialize the SDK and connect to EXP.
To authenticate on a consumer network call start():
```javascript
exp.runtime.start({
  networkUuid: 'ee146ed3-437a-46cd-89e1-f91ce8bbb942', // Network uuid
  apiKey: 'abc123' // Network API Key
}).then(() => {}); // sdk is initialized and connected to EXP
```

Device authentication is also supported:
```javascript
exp.runtime.start({
  host: 'https://api.exp.scala.com',
  deviceUuid: 'ee146ed3-437a-46cd-89e1-f91ce8bbb942', // Device uuid.
  secret: 'mashed potatoes' // Device secret
}).then(() => {}); // sdk is initialized and connected to EXP
```

User authentication is also supported:
```javascript
exp.runtime.start({
  username: "joe@joerocks.com",
  password: "123456",
  organization: "joerocks"
});
```
## exp.runtime.stop()
Disconnect from EXP and clears your credentials.

## exp.runtime.on(name, callback)
Attaches a listener for runtime events. The possible events are `online` (when a connection is established to EXP) and `offline` (when the connection to EXP is lost).

```javascript
exp.runtime.on('online', () => {
  // do something now that a connection has been established.
});
exp.runtime.on('offline', () => {
  // do something now that there is no connection
});
```

# exp.config

Name | Description
--- | ---
host | The host name of EXP.


# exp.channels

There are four channels available:
- "system": Messages to/from the system.
- "organization": Messages to/from devices across the organization.
- "experience": Messages to/from devices in the current experience.
- "location": Messages to/from devices in the current location.

### exp.channels.[channel].fling(uuid)
Fling content on a channel. UUID is the UUID of the content object you are flinging.

### exp.channels.[channel].listen(options, callback)
Register a callback for a message on this channel.

```javascript
exp.channels.location.listen({ name: 'joke72' }, payload => {
  // do something with payload.
});
```

### exp.channels.[channel].broadcast(options)
Broadcast a message out on this channel.
```javascript
exp.channels.location.broadcast({
  name: 'joke72',
  payload: {
    opening: 'knock knock?'
  },
});
```
Broadcasts can be recieved by any device that is connected to the same organization/experience/location on the given channel.

### exp.channels.[channel].request(options)
Send a request to another device. Returns a promise.
```javascript
exp.channels.organization.request({
  target: Device3,
  name: 'joke',
  payload: 'knock knock'
}).then(response => {
  console.log(response);
}).catch(error => {
  // I guess they didn't like the joke.
});
```
For non-system channels, the target should be a [Device Object](#device-object). For the system channel, no target is necessary.

Requests can only reach devices that share the same organization/experience/location for the given channel.


### exp.channels.[channel].respond(options, callback)
Respond to a request. The callback can throw an error to respond with an error. The callback can also return a promise.
```javascript
exp.channels.organization.respond({
  name: 'joke'
}, payload => {
  if (payload === 'knock knock') {
    return 'who\'s there?';
  }
  else {
    throw new Error('no thanks');
  }
});
```
Response callbacks will only be triggered when the request was sent on the same channel.

# exp.api

### exp.api.getContent(uuid)
Get a content object by UUID. Resolves to a [Content Object](#content-object). Note: The UUID value of 'root' will return the contents of the root folder of the current organization.
```javascript
exp.api.getContent('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(content => {});
```

### exp.api.findContent(uuid)
Query for multiple content nodes. Resolves to an object with a `results` array of [Content Objects](#content-object).
```javascript
exp.api.findContent({
    limit: 20, // The number of devices to retrieve at most
    skip: 5, // The number of devices to skip
    sort: 'field1', // The field to sort by.
  }).then(results => {});
```


### exp.api.getCurrentDevice()
Get the current device. Resolves to a [Device Object](#device-object).
```javascript
exp.api.getCurrentDevice().then(device => {});
```

### exp.api.getDevice(uuid)
Get a single device by UUID. Resolves to a [Device Object](#device-object).
```javascript
exp.api.getDevice('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(device => {});
```

### exp.api.findDevices(params)
Query for multiple devices. Resolves to an object with a `results` array of [Device Objects](#device-object).
```javascript
exp.api.findDevices({
    limit: 20, // The number of devices to retrieve at most
    skip: 5, // The number of devices to skip
    sort: 'field1', // The field to sort by.
  }).then(devices => {});
```

### exp.api.getThing(uuid)
Get a single device by UUID. Resolves to a [Thing Object](#thing-object).
```javascript
exp.api.getThing('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(thing => {});
```

### exp.api.findThings(params)
Query for multiple things. Resolves to an object with a `results` array of [Thing Objects](#thing-object).
```javascript
exp.api.findThing({
    limit: 20, // The number of things to retrieve at most
    skip: 5, // The number of things to skip
    sort: 'name', // The field to sort by.
  }).then(things => {});
```

### exp.api.getCurrentExperience()
Get the current experience. Resolves to an [Experience Object](#experience-object).
```javascript
exp.api.getCurrentExperience().then(experience => {});
```

### exp.api.getExperience(uuid)
Get a single experience by UUID. Resolves to a [Experience Object](#experience-object).
```javascript
exp.api.getExperience('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(experience => {});
```

### exp.api.findExperiences(params)
Query for multiple experiences. Resolves to an object with a `results` array of [Experience Objects](#experience-object).
```javascript
exp.api.findExperiences({
    limit: 20, // The number of experiences to retrieve at most
    skip: 5, // The number of experiences to skip
    sort: 'field1', // The field to sort by.
  }).then(experiences => {});
```

### exp.api.getLocation(uuid)
Get a single location by UUID. Resolves to a [Location Object](#location-object).
```javascript
exp.api.getLocation('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(location => {});
```

### exp.api.findLocations(params)
Query for multiple locations. Resolves to an object with a `results` array of [Location Objects](#location-object).
```javascript
exp.api.findLocations({
    limit: 20, // The number of locations to retrieve at most
    skip: 5, // The number of locations to skip
    sort: 'field1', // The field to sort by.
  }).then(locations => {});
```

### exp.api.identifyDevice(deviceUuid)
Request a device to identify itself. Resolve to response from targeted device
```javascript
exp.api.identifyDevice('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(rsp => {});
```

### exp.api.getData(key, group)
Get data by key and group. Resolves to a [Data Object](#data-object).
```javascript
exp.api.getData("fluffy", "cats").then(data => {});
```

### exp.api.findData(params)
Query for multiple data objects. Resolve to an object with a `results` array of [Data Objects](#data-object).
```javascript
exp.api.findData({
  group: 'cats'
}).then(cats => {});
```

### exp.api.getFeed(uuid)
Get a single feed by UUID. Resolves to a [Feed Object](#feed-object).
```javascript
exp.api.getFeed('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(feed => {});
```

### exp.api.findFeeds(params)
Query for multiple feeds. Resolves to an object with a `results` array of [Feed Objects](#feed-object).
```javascript
exp.api.findFeeds({
    limit: 20, // The number of feeds to retrieve at most
    skip: 5, // The number of feeds to skip
    sort: 'field1', // The field to sort by.
  }).then(results => {});
```

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

### Feed Object

##### feed.uuid
The feed's UUID

##### feed.getData()
Get the feed's data. Resolves to the output of the feed query.
```javascript
device.getData().then(data => {});
```
