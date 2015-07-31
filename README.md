# exp-js-sdk

## scala.init(options)
Initialize the SDK and connect to EXP.
```javascript
scala.init({
  host: 'http://exp.scala.com',
  uuid: 'ee146ed3-437a-46cd-89e1-f91ce8bbb942', // Device uuid.
  secret: 'potatoes' // Device secret
}).then(() => {}); // sdk is initialized and connected to EXP 
```

## scala.config
#### scala.config.host
The host name of EXP.

## scala.connection

#### scala.connection.on(name, callback)
Attach a listener for connection events. The possible events are `online` (when a connection is established to EXP) and `offline` (when the connection to EXP is lost).

```javascript
scala.connection.on('online', () => {});
scala.connection.on('offline', () => {});
```

## scala.channels.[name]

There are four channels available:
- "system": Messages to/from the system.
- "organization": Messages to/from devices across the organization.
- "experience": Messages to/from devices in the current experience.
- "location": Messages to/from devices in the current location.

#### channel.listen(options, callback)
Register a callback for a message on this channel.
```javascript
scala.channels.location.listen({ name: 'eventName1' }, payload => {
  // do something with payload.
});
```

#### channel.broadcast(options)
Broadcast a message out on this channel.
```javascript
scala.channels.experience.broadcast({ 
  name: 'checkOutMySweetEventJoke', 
  payload: {
    opening: 'knock knock?'
  },
});
```
#### channel.request(options)
#### channel.respond(options, callback)


## scala.api

#### scala.api.getCurrentDevice()
Get the current device. Resolves to a [Device Object](#device-object).
```javascript
scala.api.getCurrentDevice().then(device => {});
```

#### scala.api.getDevice(options)
Get a single device by UUID. Resolves to a [Device Object](#device-object).
```javascript
scala.api.getDevice({
  uuid: 'ee146ed3-437a-46cd-89e1-f91ce8bbb942' // The uuid of the device.
}).then(device => {});
```

#### scala.api.getDevices(options)
Query for multiple devices. Resolves to an array of [Device Objects](#device-object).
```javascript
scala.api.getDevices({
  params: {
    limit: 20, // The number of devices to retrieve at most
    skip: 5, // The number of devices to skip
    sort: 'field1', // The field to sort by.
  }
}).then(devices => {});
```

#### scala.api.getCurrentExperience()
Get the current experience. Resolves to an [Experience Object](#experience-object).
```javascript
scala.api.getCurrentExperience().then(experience => {});
```

#### scala.api.getExperience(options)
Get a single experience by UUID. Resolves to a [Experience Object](#experience-object).
```javascript
scala.api.getExperience({
  uuid: 'ee146ed3-437a-46cd-89e1-f91ce8bbb942' // The uuid of the experience.
}).then(experience => {});
```

#### scala.api.getExperiences(options)
Query for multiple experiences. Resolves to an array of [Experience Objects](#experience-object).
```javascript
scala.api.getExperiences({
  params: {
    limit: 20, // The number of devices to retrieve at most
    skip: 5, // The number of devices to skip
    sort: 'field1', // The field to sort by.
  }
}).then(experiences => {});
```

# Abstract API Objects

## Device Object

#### device.uuid
The devices UUID

#### device.getExperience()
Get the device's experience. Resolves to an [Experience Object](#experience-object)
```javascript
device.getExperience().then(experience => {});
```

### device.getZone()
Get the device's zone. Resolves to a [Zone Object](#zone-object)
```javascript
device.getZone().then(zone => {});
```


## Experience Object

#### experience.uuid 
The experience's UUID.

#### experience.raw
Temporary. The raw experience object. 

## Location Object

#### location.uuid
The location's UUID.

### location.getZones()
Get all of the zones in this location. Returns an array of [Zone Objects](#zone-object).
```javascript
location.getZones().then(zones => {});
```




## Zone Object
#### zone.uuid
The zone's UUID.

#### zone.getDevices()
Get the zone's devices. Returns an array of [Device Objects](#device-object)

```javascript
zone.getDevices().then(devices => {});
```

#### zone.getLocation()
Get the zone's location. Returns a [Location Object](#location-object)

```javascript
zone.getLocation().then(location => {});
```
