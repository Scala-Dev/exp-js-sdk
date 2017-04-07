# Installation

## Bower

The easiest way to get the SDK for standalone browser usage is using `bower`.

```
bower install exp-sdk
```

Then include the sdk in a script tag from the bower_components directory. You can then access the sdk as the window bound global `EXP`.


```html
<script src="bower_components/exp-sdk/exp-sdk.min.js"></script>
<script>// I have access to EXP!</script>
```


## NPM

To use the EXP SDK with NodeJS, install using `npm`:

```
npm install exp-sdk
```

and require in the `exp` module.

```javascript
const EXP = require('exp-sdk');
```



# Runtime

## Starting the SDK

**`EXP.start(options)`**

Starts and returns an sdk instance. Can be called multiple times to start multiple independent instances of the sdk. The sdk can be started using user, device, or consumer app credentials, or directly with an authentication payload. `options` is an object that supports the following properties:

- `username` The username used to log in to EXP. Required user credential.
- `password` The password of the user. Required user credential.
- `organization` The organization of the user. Required user credential.
- `uuid` The uuid of the device or consumer app. Required consumer app credential and required device credential unless `allowPairing` is `true`.
- `secret` The device secret. Required device credential unless `allowPairing` is `true`.
- `apiKey` The consumer app api key. Required consumer app credential.
- `allowPairing` Whether or not to allow authentication to fallback to pairing mode. If `true`, invalid or missing device credentials will start the sdk in pairing mode. Defaults to `false`.
- `host` The api host to authenticate with. Defaults to `https://api.goexp.io`.
- `enableNetwork` Whether or not to establish a socket connection with the network for real time communication. If `false` you will not be able to listen for broadcasts. Defaults to `true`.
- `auth` A valid authentication payload. Can be specified with credentials. SDK will fallback to credentials if auth payload fails.

```javascript
# Authenticating as a user.
exp = EXP.start({ username: 'joe@scala.com', password: 'joeIsAwes0me', organization: 'joeworld' })

# Authenticating as a device.
exp = EXP.start({ uuid: '[uuid]', secret: '[secret]' });

# Authenticating as a consumer app.
exp = EXP.start({ uuid: '[uuid]', apiKey: '[api-key]' });

# Authenticating with previous auth payload.
exp = EXP.start({ uuid: '[uuid]', apiKey: '[api-key]', auth: auth });

```

## Stopping the SDK

**`EXP.stop()`**

Stops all running instance of the sdk, cancels all listeners and closes socket connections.

```javascript
exp1 = EXP.start(options1)
exp2 = EXP.start(options2)

EXP.stop()
exp1.createDevice()  // Error
```

New instance can still be started by calling `EXP.start()`.


**`exp.stop()`**

Stops the the SDK instance and clears all event listeners. Sdk instance cannot be restarted and any invokation on the instance will result in an Error being thrown.

## Authentication

**`exp.getAuth()`**

Resolves to the current authentication payload. The authentication payload may be updated by performing this request.

**`exp.auth`**

Returns the current authentication payload. Will be null if not yet authenticated.

**`exp.on('update',callback)`**

Callback is called when authentication payload is updated. Returns a [listener](#listener).


**`exp.on('error',callback)`**

Register a callback for when the sdk instance encounters a critical error and cannot continue. The callback is called with the error as the first argument. This is generally due to authentication failure. Returns a [listener](#listeners).

```javascript
const exp = EXP.start(options)
exp.on('error', error => console.error('Uhoh, the sdk instance died.', error));
```



## Listeners

**listener.cancel()**

Cancels the registered callback. This operation cannot be undone.


# Real Time Communication

## Status


**`exp.on('offline',callback)`**

Callback is called when connection to EXP is lost. Returns a [listener](#listener).


**`exp.on('online',callback)`**

Callback is called when connection to EXP is established. Returns a [listener](#listeners).

**`exp.isConnected`**

Whether or not you are connected to EXP.


## Channels

 **`exp.getChannel(name, options)`**

 Returns a channel with the given name and options. Options is a javascript object with two flags: `consumer` and `system`. Consumer devices can only listen and broadcast on consumer channels. System channels are listen only and can receive broadcasts about system events.

```javascript
consumerChannel = exp.getChannel('my-consumer-channel', { consumer: true })
channel = exp.getChannel('my-channel');
```


**`channel.broadcast(name, payload, timeout)`**

Sends a broadcast with given `name` and `payload` on the channel. Waits for responses for `timeout` milliseconds and resolves with an array of responses.

```javascript
channel.broadcast('hi!', { test: 'nice to meet you!' }).then(responses => {
  responses.forEach(response => console.log(response));
});
```


**`channel.listen(name, callback)`**

Registers a [listener](#listeners) callback for events on the channel with the given `name`. Resolves to a [listener](#listeners) when the callback is registered and the connection has subscribed to the channel.

The callback is called with the broadcast payload as the first argument and a `respond` method as the second argument. Call the `respond` method to send a response back to the broadcaster.

```javascript
channel = exp.getChannel('my-channel')
channel.listen('hi!', (payload, respond) => {
  if (payload && payload.text === 'hi') respond({ text: 'hi to you too!' });
});
```

**`channel.listen(callback)`**

Registers a [listener](#listeners) callback for ALL events on the channel. Resolves to a [listener](#listeners) when the callback is registered and the connection has subscribed to the channel.

The callback is called with the raw message object as the first argument (with `name` and `payload` properties) and a `respond` method as the second argument. Call the `respond` method to send a response back to the broadcaster.

```javascript
channel = exp.getChannel('my-channel')
channel.listen('myEvent', (payload, respond) => {
  if (payload && payload.text === 'hi') respond({ text: 'hi to you too!' });
});
```




**`channel.fling(payload)`**

Fling an app launch payload on the channel.
```javascript
channel.fling({ appTemplate: { uuid: '[uuid]' } });
```

**`channel.identify()`**

Requests that [devices](#device) listening for this event on this channel visually identify themselves. Implementation is device specific; this is simply a convience method.


# API

## Devices

Devices inherit all [common resource methods and attributes](#resources).

**`exp.getDevice(uuid)`**

Resolves to the device with the given uuid or `null` if the device could be found.

**`exp.createDevice(document)`**

Resolves to a device created based on the supplied document.


```javascript
exp.createDevice({ subtype: 'scala:device:player' }).then(device => {});
```

**`exp.findDevices(params)`**

Resolves to an array of devices matching the given query parameters. `params` is a optional object map of query parameters. Array also contains original properties of the API response.


**`exp.getCurrentDevice()`**

Resolves to the current device or null if not a device.

**`exp.deleteDevice(uuid)`**

Resolves on success.

**`device.getLocation()`**

Resolves to the device's [location](#locations) or `null`.

**`device.getZones()`**

Resolves to an array of the device's [zones](#zones).

**`device.getExperience()`**

Resolves to the device's [experience](#experiences) or `null`

**`device.delete()`**

Resolves on success.



## Things

Things inherit all [common resource methods and attributes](#resources).

**`exp.getThing(uuid)`**

Resolves to the thing with the given uuid or `None` if no things could be found.

**`exp.createThing(document=None)`**

Resolves to a thing created based on the supplied document.

```javascript
exp.createThing({ 'subtype': 'scala:thing:rfid', 'id': '[rfid]', 'name': 'my-rfid-tag' }).then(thing => {});
```

**`exp.findThings(params)`**

Resolves to an array of things matching the given query parameters. `params` is an optional object map of query parameters. Array also contains original properties of the API response.

**`exp.deleteThing(uuid)`**

Resolves on success.

**`thing.getLocation()`**

Resolves to the thing's [location](#locations) or `null`.

**`thing.getZones()`**

Resolves to a list of the thing's [#zones](#zones).

**`thing.getExperience()`**

Resolves to the the device's [experience](#experiences) or `null`

**`thing.delete()`**

Resolves on success.


## Experiences

Experiences inherit all [common resource methods and attributes](#resources).

**`exp.getExperience(uuid)`**

Resolves to the experience with the given uuid or `null` if no experience could be found.

**`exp.createExperience(document)`**

Resolves to an experience created based on the supplied document.

**`exp.findExperiences(params)`**

Returns a list of experiences matching the given query parameters. `params` is a optional object map of query parameters. Array also contains original properties of the API response.


**`exp.getCurrentExperience()`**

Resolves to the current experience or null.

**`exp.deleteExperience(uuid)`**

Resolves on success.

**`experience.getDevices(params)`**

Resolves to an array of [devices](#devices) that are part of this experience. `params` is a optional object map of query parameters. Array also contains original properties of the API response.

**`experience.delete()`**

Resolves on success.

## Locations

Locations inherit all [common resource methods and attributes](#resources).

**`exp.getLocation(uuid)`**

Resolves to the location with the given uuid or `null` if no location could be found.

**`exp.createLocation(document)`**

Resolves to a location created based on the supplied document.

**`exp.findLocations(params)`**

Resolves to an array of locations matching the given query parameters. `params` is a optional object map of query parameters. Array also contains original properties of the API response.

**`exp.getCurrentLocation()`**

Resolves to the current location or null.

**`exp.deleteLocation(uuid)`**

Resolves on success.

**`location.getDevices(params)`**

Resolves to an array of [devices](#devices) that are part of this location. `params` is a optional object map of query parameters. Array also contains original properties of the API response.


**`location.getThings(params)`**

Resolves to an array of [things](#things) that are part of this location. `params` is a optional object map of query parameters. Array also contains original properties of the API response.

**`location.getZones()`**

Resolves to an array of [zones](#zones) that are part of this location.

**`location.getLayoutUrl()`**

Returns a url pointing to the location's layout image.

**`location.delete()`**

Resolves on success.

## Zones

Zones inherit the [common resource methods and attributes](#resources) `save()`, `refresh()`, and `getChannel()`.

**`exp.getCurrentZones()`**

Resolves to the current zones or an empty array.

**`zone.key`**

The zone's key.

**`zone.name`**

The zone's name.

**`zone.getDevices(params)`**

Resolves to an array of [devices](#devices) that are members of this zone. `params` is a optional object map of query parameters. Array also contains original properties of the API response.

**`zone.getThings(params)`**

Resolves to an array of [things](#things) that are members of this zone. `params` is a optional object map of query parameters. Array also contains original properties of the API response.

**`zone.getLocation()`**

Resolves to the zone's [location](#locations)


## Feeds
Feeds inherit all [common resource methods and attributes](#resources).

**`exp.getFeed(uuid)`**

Resolves to the feed with the given uuid or `null` if no feed could be found.

**`exp.createFeed(document)`**

Resolves to a feed created based on the supplied document.

```javascript
exp.createFeed({ subtype: 'scala:feed:weather', searchValue: '16902', name: 'My Weather Feed'  }).then(feed => {});
```

**`exp.findFeeds(params)`**

Resolves to an array of feeds matching the given query parameters. `params` is a optional object map of query parameters. Array also contains original properties of the API response.

```javascript
exp.findFeeds({ subtype: 'scala:feed:facebook' }).then(feeds => {})
```

**`exp.deleteFeed(uuid)`**

Resolves on success.

**`feed.getData(params)`**

Resolves to the feed's data. Params is an object of key value query params for dynamic feeds.

**`feed.delete()`**

Resolves on success.

## Data

Data items inherit the [common resource methods and attributes](#resources) `save()`, `refresh()`, and `getChannel()`.
There is a limit of 16MB per data document.

**`exp.getData(group, key)`**

Resolves to the data item with the given group and key or `null` if the data item could not be found.

```javascript
exp.getData('cats', 'fluffy').then(data => {});
```

**`exp.createData(groupr, key, value)`**

Resolves to a data item created based on the supplied group, key, and value.

```javascript
exp.createData('cats', 'fluffy', { 'color': 'brown'}).then(data => {});
```

**`exp.findData(params)`**

Resolves to an array of data items matching the given query parameters. `params` is a dictionary of query parameters.

```javascript
exp.findData({ group: 'cats' }).then(items => {});
```

**`exp.deleteData(group, key)`**

Resolves on success.

**`data.key`**

The data item's key. Settable.

**`data.group`**

The data item's group. Settable

**`data.value`**

The data item's value. Settable.

**`data.delete()`**

Resolves on success.

## Content

Content items inherit all [common resource methods and attributes](#resources) except `save()`.

**`exp.getContent(uuid)`**

Resolves to the content item with the given uuid or `null` if no content item could be found.

**`exp.findContent(params)`**

Resolves to an array of content items matching the given query parameters. `params` is a optional object map of query parameters. Array also contains original properties of the API response.

**`content.subtype`**

The content item's subtype. Not settable.

**`content.getUrl()`**

Returns the delivery url for this content item.

**`content.hasVariant(name)`**

Returns a boolean indicating whether or not this content item has a variant with the given name.

**`content.getVariantUrl(name)`**

Returns the delivery url for a variant of this content item.


**`content.getChildren(params)`**

Resolves to an array of content items children with property total. `params` is a optional object map of query parameters. Array also contains original properties of the API response.

## Resources

These methods and attributes are shared by many of the abstract API resources.

**`resource.uuid`**

The uuid of the resource. Cannot be set.

**`resource.name`**

The name of the resource. Can be set directly.

**`resource.document`**

The resource's underlying document

**`resource.save()`**

Saves the resource and updates the document in place. Returns a promise to the save operation.

```javascript
exp.getDevice('[uuid]').then(device => {
  device.name = 'newName';
  device.save().then(() => console.log('Saved it!'));
});
```

**`resource.refresh()`**

Refreshes the resource's underlying document in place. Returns a promise to refresh operation.

```javascript
exp.createDevice().then(device => {
  exp.getDevice(device.uuid).then(device2 => {
    device.name = 'newName';
    device.save().then(() => {
      device2.refresh().then(() => {
        // device2 name is now updated.
      });
    });
  });
});
```

**`resource.getChannel(channelOptions)`**

Returns the [channel](#channels) whose name is contextually associated with this resource.


## Custom Requests

These methods send custom authenticated API calls. `params` is a map of url params and `body` is a JSON serializable document. in seconds, to wait for the request to complete. `path` is relative to the api host root. All methods will return a promise to the response document.

**`exp.get(path, params)`**

Send a GET request.

```javascript
exp.get('/api/devices', { 'name': 'my-name' }).then(result => {});
```

**`exp.post(path, body, params)`**

Send a POST request.

```javascript
exp.post('/api/experiences', {}).then(document => {});
```

**`exp.patch(path, body, params)`**

Send a PATCH request.

```javascript
exp.patch('/api/experiences/[uuid]', { name: 'new-name' }).then(document => {});
```


**`exp.put(path, body, params)`**

Send a PUT request.

```javascript
 exp.put('/api/data/cats/fluffy', { eyes: 'blue'}).then(document => {});
```

**`exp.delete(path, params)`**

Send a DELETE request.

```javascript
exp.delete('/api/location/[uuid]').then(() => {});
```

## Running the SDK Unit Tests  
**Requirements**
The tests require Mocha  
```bash
npm install -g Mocha
```  
The tests project must be compiled with Babel  
```bash
npm install -g babel-cli
npm install -g babel-core
```

**Preparing the Environment**  
The SDK requires access to a test API, Network, and Gateway.  The databases the API depends on will have to be seeded with a user, role, organization, devices, and content. 
Running the API with **NODE_ENV=test** will cause the API to seed these things into the databases.  
- *API* https://github.com/ScalaInc/exp-api
- *Gateway* https://github.com/ScalaInc/exp-gateway
- *Network* https://github.com/ScalaInc/exp-network

**Configuring**
The settings for the test are located in **test/index.js**. The *username*, *password*, *api-key*, *test-secret*, and *organization* will have to match those used in the API test configuration.  
The *host* should be set to the address of the Gateway.  

**Running**
```bash
npm run build
npm test
```
