# scala.init(options)
Initialize the SDK and connect to EXP.
```javascript
scala.init({
  host: 'http://exp.scala.com',
  uuid: 'ee146ed3-437a-46cd-89e1-f91ce8bbb942', // Device uuid.
  secret: 'mashed potatoes' // Device secret
}).then(() => {}); // sdk is initialized and connected to EXP
```

# scala.config

Name | Description
--- | ---
host | The host name of EXP.

# scala.connection

### scala.connection.on(name, callback)
Attaches a listener for connection events. The possible events are `online` (when a connection is established to EXP) and `offline` (when the connection to EXP is lost).

```javascript
scala.connection.on('online', () => {
  // do something now that a connection has been established.
});
scala.connection.on('offline', () => {
  // do something now that there is no connection
});
```

# scala.channels

There are four channels available:
- "system": Messages to/from the system.
- "organization": Messages to/from devices across the organization.
- "experience": Messages to/from devices in the current experience.
- "location": Messages to/from devices in the current location.

### scala.channels.[channel].listen(options, callback)
Register a callback for a message on this channel.

```javascript
scala.channels.location.listen({ name: 'joke72' }, payload => {
  // do something with payload.
});
```

### scala.channels.[channel].broadcast(options)
Broadcast a message out on this channel.
```javascript
scala.channels.location.broadcast({
  name: 'joke72',
  payload: {
    opening: 'knock knock?'
  },
});
```
Broadcasts can be recieved by any device that is connected to the same organization/experience/location on the given channel.

### scala.channels.[channel].request(options)
Send a request to another device. Returns a promise.
```javascript
scala.channels.organization.request({
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


### scala.channels.[channel].respond(options, callback)
Respond to a request. The callback can throw an error to respond with an error. The callback can also return a promise.
```javascript
scala.channels.organization.respond({
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

# scala.api

### scala.api.getCurrentDevice()
Get the current device. Resolves to a [Device Object](#device-object).
```javascript
scala.api.getCurrentDevice().then(device => {});
```

### scala.api.getDevice(uuid)
Get a single device by UUID. Resolves to a [Device Object](#device-object).
```javascript
scala.api.getDevice('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(device => {});
```

### scala.api.getDevices(params)
Query for multiple devices. Resolves to an array of [Device Objects](#device-object).
```javascript
scala.api.getDevices({
    limit: 20, // The number of devices to retrieve at most
    skip: 5, // The number of devices to skip
    sort: 'field1', // The field to sort by.
  }).then(devices => {});
```

### scala.api.getCurrentExperience()
Get the current experience. Resolves to an [Experience Object](#experience-object).
```javascript
scala.api.getCurrentExperience().then(experience => {});
```

### scala.api.getExperience(uuid)
Get a single experience by UUID. Resolves to a [Experience Object](#experience-object).
```javascript
scala.api.getExperience('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(experience => {});
```

### scala.api.getExperiences(params)
Query for multiple experiences. Resolves to an array of [Experience Objects](#experience-object).
```javascript
scala.api.getExperiences({
    limit: 20, // The number of devices to retrieve at most
    skip: 5, // The number of devices to skip
    sort: 'field1', // The field to sort by.
  }).then(experiences => {});
```

### scala.api.getLocation(uuid)
Get a single location by UUID. Resolves to a [Location Object](#location-object).
```javascript
scala.api.getLocation('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(location => {});
```

### scala.api.getLocations(params)
Query for multiple locations. Resolves to an array of [Location Objects](#location-object).
```javascript
scala.api.getLocations({
    limit: 20, // The number of devices to retrieve at most
    skip: 5, // The number of devices to skip
    sort: 'field1', // The field to sort by.
  }).then(locations => {});
```

### scala.api.getZone(uuid)
Get a single zone by UUID. Resolves to a [Zone Object](#zone-object).
```javascript
scala.api.getZone('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(zone => {});
```

### scala.api.getZones(params)
Query for multiple zones. Resolves to an array of [Zone Objects](#zone-object).
```javascript
scala.api.getZones({
    limit: 20, // The number of devices to retrieve at most
    skip: 5, // The number of devices to skip
    sort: 'field1', // The field to sort by.
  }).then(zones => {});
```

### scala.api.identifyDevice(deviceUuid)
Request a device to identify itself. Resolve to response from targeted device
```javascript
scala.api.identifyDevice('ee146ed3-437a-46cd-89e1-f91ce8bbb942').then(rsp => {});
```

# Abstract API Objects

### Device Object

##### device.uuid
The devices UUID

##### device.getExperience()
Get the device's experience. Resolves to an [Experience Object](#experience-object)
```javascript
device.getExperience().then(experience => {});
```

##### device.getZone()
Get the device's zone. Resolves to a [Zone Object](#zone-object)
```javascript
device.getZone().then(zone => {});
```

##### device.identify()
Request the device to identify itself. Resolve to response from targeted device
```javascript
device.identify().then(rsp => {});
```


### Experience Object

#### experience.uuid
The experience's UUID.

#### experience.raw
Temporary. The raw experience object.

### Location Object

##### location.uuid
The location's UUID.

##### location.getZones()
Get all of the zones in this location. Returns an array of [Zone Objects](#zone-object).
```javascript
location.getZones().then(zones => {});
```




### Zone Object
##### zone.uuid
The zone's UUID.

##### zone.getDevices()
Get the zone's devices. Returns an array of [Device Objects](#device-object)

```javascript
zone.getDevices().then(devices => {});
```

##### zone.getLocation()
Get the zone's location. Returns a [Location Object](#location-object)

```javascript
zone.getLocation().then(location => {});
```
