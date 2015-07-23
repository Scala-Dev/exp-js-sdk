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


## Abstract API Objects
#### Device Object
