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
