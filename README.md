# exp-js-sdk

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

#### device.getLocation()
Get the device's location. Resolves to a [Location Object](#location-object)
```javascript
device.getLocation().then(location => {});
```

### device.getZone()
Get the device's zone. Resolves to a [Zone Object](#zone-object)
```javascript
device.getZone().then(zone => {});
```

#### device.broadcast(options)
Broadcast a message about this device.
```javascript
device.broadcast({name: 'I see this device!'})
```

#### device.listen(options, callback)
Listen for events about this device.
```javascript
const cancel = device.listen({
  name: 'I see this device!'
}, (payload, message) => { 
  console.log(message.source + ' saw the device! Going to stop listening now.');
  cancel(); 
});
```

#### device.respond(options, callback)
** ONLY IF DEVICE IS THE CURRENT DEVICE **

Respond to a request sent to the device. 

```javascript
const cancel = device.respond({
  name: 'giveMeSomeMoney',
  scope: 'moneyRequests', // optional filter
}, payload => { 
  if (payload.amount > 2) {
   throw new Error('sorry i haz only 2 dolla');
  } 
  cancel(); // I'm gone giving away money.
  return {
    moneyForYou: payload.amount,
  };
})
```  
  
#### device.request(options)
** ONLY IF DEVICE IS NOT THE CURRENT DEVICE **

Send a request to the device.

```javascript
device.request({
  name: 'giveMeSomeMoney',
  scope: 'moneyRequests'  // optional filter
  payload: {
    amount: 'much'
  }
}).then(response => { console.log('I got some money!'); })
  .catch(error => { console.log('sad face'); })
```


## Experience Object

#### experience.uuid 
The experience's UUID.

#### experience.raw
Temporary. The raw experience object. 

#### experience.broadcast(options)
Broadcast a message about this experience.
```javascript
experience.broadcast({name: 'IAmExperiencing', payload: { foo: 'manchu' }})
```

#### experience.listen(options, callback)
Listen for events about this experience.
```javascript
const cancel = device.listen({
  name: 'IAmExperiencing'
}, payload => {});
```

## Location Object

#### location.uuid
The location's UUID.

### location.getDevices()
Get all of the devices in this locaiton. Returns an array of [Device Objects](#device-object).
```javascript
location.getDevices().then(devices => {});
```

### location.getZones()
Get all of the zones in this location. Returns an array of [Zone Objects](#zone-object).
```javascript
location.getZones().then(zones => {});
```

#### location.broadcast(options)
Broadcast a message about this location.
```javascript
location.broadcast({name: 'thisDudeIsDancingHere', payload: { name: 'joe' }})
```

#### location.listen(options, callback)
Listen for events about this location.
```javascript
const cancel = location.listen({
  name: ''
}, payload => {});
```



## Zone Object
