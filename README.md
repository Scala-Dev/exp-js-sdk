
- [Getting Started](#getting-started)
  - [Bower](#bower)
  - [NPM](#npm)
- [Example](#example)
- [Reference](#reference)
  - [Runtime](#runtime)
  - [Channels](#channels)
  - [Listeners](#listeners)
  - [Devices](#devices)
  - [Things](#things)
  - [Experiences](#experiences)
  - [Locations](#locations)
  - [Zones](#zones)

  - [Feeds](#feeds)
  - [Data](#data)
  - [Content](#content)
  - [Startup Options](#startup-options)
  - [Channel Options](#channel-options)






# Getting Started

## Bower

The easiest way to get the SDK for standalone browser usage is using `bower`.

```
bower install exp-sdk
```

Then include the sdk in a script tag from the bower_components directory. You can then access the sdk as the window bound global `exp`.

```html
<script src="bower_components/exp-sdk.min.js"></script>
<script>// I have access to exp module!</script>
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

# Example

More examples can be found in the [documentation](https://docs.goexp.io).

```javascript
const EXP = require('exp-sdk');

// Start the SDK.
const exp = EXP.start({ uuid: 'my-uuid', secret: 'my-secret'});

// Listen for a hello message on test channel and broadcast message.
const channel = exp.getChannel('test');
channel.listen('hello', () => { console.log('I got a message!'); }).then(() => {
  channel.broadcast('hello!');
});

// Identify all devices in the given experience.
exp.getExperience('my-experience-uuid').then(experience => {
  if (!experience) return;
  experience.getDevices().then(devices => devices.forEach(device => device.identify()));
});


```


# Reference

## Runtime
 | Description
--- | ---
`EXP.start(options)` | Starts and returns an sdk instance. `options` is an object containing [startup options](#startup-options). Throws an error if `options` is invalid.
`EXP.stop()` | Stops all running sdk instances.
`exp.getAuth()` | Resolves to the current authentication payload.
`exp.isConnected` | Whether or not you are connected to the network.
`exp.stop()` | Stops the the instance and clears all event listeners.
`exp.on('online',callback)` | Callback is called when connection to the network is established. Returns a [listener](#listener).
`exp.on('update',callback)` | Callback is called when authentication payload is updated. Returns a [listener](#listener).
`exp.on('offline',callback)` | Callback is called when connection to the network is lost. Returns a [listener](#listener).
`exp.on('error',callback)` | Callback is called with an error when a critical error occurs and the SDK cannot continue. Returns a [listener](#listener).


## Channels
 | Description
 --- | ---
 `exp.getChannel(name, options)` | Returns a channel with the given name and [channel options](#channel-options].
 `channel.broadcast(name, payload, timeout)` | Sends a broadcast with given name and payload on the channel. Waits for responses for timeout milliseconds.
 `channel.listen(name, callback` | Listens for broadcasts with given name on the channel. `callback` will be called with the broadcast payload and the response callback.Resolves to a [listener](#listener) when the channel is registered.
 `channel.fling(payload, timeout)` | Sends a fling broadcast on this channel with the given payload and timeout.


## Listeners
 | Description
 --- | ---
`listener.cancel()` | Cancels the registered callback associated with the listener.


## Devices

 | Description
--- | ---
`exp.getDevice(uuid)` | Resolves to the device with given uuid or `null`.
`exp.findDevices(params)` | Resolves to an array of devices matching the given query parameters.
`exp.createDevice(document)` | Resolves to a newly created device.
`device.document` | The device's underlying document.
`device.refresh()` | Resolves when the device is refreshed. The document is updated in place.
`device.save()` | Resolves when the device is saved. The document is updated in place.
`device.getChannel(options)` | Returns the [channel](#channel) for this device with the given [channel options](#channel-options).
`device.fling(payload, options, timeout)` | Sends fling event on device's [channel](#channel) with given [channel options](#channel-options) and broadcast `timeout`.
`device.getExperience()` | Resolves to the device's [experience](#experience) or null.
`device.getLocation()` | Resolve to the device's [location](#locations) or null.
`device.getZones()` | Resolves to an array of the device's [zones](#zones).

## Things

 | Description
--- | ---
`exp.getThing(uuid)` | Resolves to the thing with given uuid or `null`.
`exp.findThings(params)` | Resolves to an array of things matching the given query parameters.
`exp.createThing(document)` | Resolves to a newly created thing.
`thing.document` | The thing's underlying document.
`thing.refresh()` | Resolves when the thing is refreshed. The document is updated in place.
`thing.save()` | Resolves when the thing is saved. The document is updated in place.
`thing.getChannel(options)` | Returns the [channel](#channel) for this thing with the given [channel options](#channel-options).
`thing.fling(payload, options, timeout)` | Sends fling event on thing's [channel](#channel) with given [channel options](#channel-options) and broadcast `timeout`.
`thing.getLocation()` | Resolve to the thing's [location](#locations) or null.
`thing.getZones()` | Resolves to an array of the thing's [zones](#zones).

## Experiences

 | Description
--- | ---
`exp.getExperience(uuid)` | Resolves to the experience with given uuid or `null`.
`exp.findExperiences(params)` | Resolves to an array of experiences matching the given query parameters.
`exp.createExperience(document)` | Resolves to a newly created experience.
`experience.document` | The experience's underlying document.
`experience.refresh()` | Resolves when the experience is refreshed. The document is updated in place.
`experience.save()` | Resolves when the experience is saved. The document is updated in place.
`experience.getChannel(options)` | Returns the [channel](#channel) for this experience with the given [channel options](#channel-options).
`experience.fling(payload, options, timeout)` | Sends fling event on experience's [channel](#channel) with given [channel options](#channel-options) and broadcast `timeout`.
`experience.getDevices()` | Resolves to an array of [devices](#devices) in the experience.



## Locations
 | Description
 --- | ---
`exp.getLocation(uuid)` | Resolves to the location with given uuid or `null`.
`exp.findLocations(params)` | Resolves to an array of locations matching the given query parameters.
`exp.createLocation(document)` | Resolves to a newly created location.
`location.document` | The location's underlying document.
`location.refresh()` | Resolves when the location is refreshed. The document is updated in place.
`location.save()` | Resolves when the location is saved. The document is updated in place.
`location.getChannel(options)` | Returns the [channel](#channel) for this location with the given [channel options](#channel-options).
`location.fling(payload, options, timeout)` | Sends fling event on location's [channel](#channel) with given [channel options](#channel-options) and broadcast `timeout`.
`location.getDevices()` | Resolves to an array of [devices](#devices) in the location.
`location.getThings()` | Resolves to an array of [things](#things) in the location.
`location.getZones()` | Resolves to an array of [zones](#zones) in the location.
`location.getLayoutUrl()` | Returns url to location layout image.


## Zones
 | Description
 --- | ---
`zone.document` | The zone's underlying document.
`zone.refresh()` | Resolves when the zone is refreshed. The document is updated in place.
`zone.save()` | Resolves when the zone is saved. The document is updated in place.
`zone.getChannel(options)` | Returns the [channel](#channel) for this zone with the given [channel options](#channel-options).
`zone.fling(payload, options, timeout)` | Sends fling event on zone's [channel](#channel) with given [channel options](#channel-options) and broadcast `timeout`.
`zone.getDevices()` | Resolves to an array of [devices](#devices) in the zone.
`zone.getThings()` | Resolves to an array of [things](#things) in the zone.



### TESTED TILL HERE



## Startup Options
## Channel Options



## Feeds
- ```exp.getFeed(uuid)```: Resolves to the feed with the given uuid.
- ```exp.findFeeds(params)```: Resolves to an array of matching feeds. Params is a dictionary of query params. See the API docs.
- ```exp.createFeed(document)```: Resolves to an unsaved feed.
- ```feed.save()```: Saves or updates the feed.
- ```feed.refresh()```: Refreshes the feed.
- ```feed.uuid```
- ```feed.document```
- ```feed.getChannel(options)```: Returns a channel for communication about the feed. See [Channels](#channels).

## Content
- ```exp.getContent(uuid)```: Resolves to the content with the given uuid.
- ```exp.findContent(params)```: Resolves to an array of matching content. Params is a dictionary of query params. See the API docs. 
- ```content.refresh()```: Refreshes the content.
- ```content.uuid```: The content's uuid.
- ```content.document```: The content's underlying document.
- ```content.getChannel(options)```: Returns a channel for communication about the content. See [Channels](#channels).
- ```content.get_url()```: Returns the delivery URL for the content.
- ```content.get_variant_url(name)```: Returns the delivery URL for a variant.
- ```content.has_variant(name)```: Returns ```true``` or ```false``` to indicate if the specified variant exists.
- ```content.subtype```: The subtype of the content.

## Data
- ```exp.getData(key, group)```: Resolves to the data resource for the given key and group. Group is set to "default" if not specified. 
- ```exp.findData(params)```: Resolves to an array of matching data resources. Params is a dictionary of query params. See the API docs.
- ```exp.createData(key, value, group)```: Creates an unsaved data object. Group is set to "default" if not specified.
- ```data.save()```: Save the data object.
- ```data.refresh()```: Refresh the data.
- ```data.value```
- ```data.key```
- ```data.group```


# Examples


## Creating a Device and Listening for Updates

Updates to API resources are sent out over a system channel with the event name "update".

```javascript
exp.createDevice({ 'name': 'my_sweet_device' }).then(device => {
  return device.save().then(() => {
    device.getChannel({ system: true }).listen('update', payload => {
      console.log('Device was updated!');
    });
  });
});
```


## Modifying a Resource in Place

```javascript
exp.getExperience('[uuid]').then(experience => {
  experience.document.name = 'new name';
  return experience.save()
});
```


## Using The EXP Network

The EXP network facilitates real time communication between entities connected to EXP. A user or device can broadcast a JSON serializable payload to users and devices in your organization, and listeners to those broadcasts can respond to the broadcasters.

### Channels

All messages on the EXP network are sent over a channel. Channels have a name, and two flags: ```system``` and ```consumer```.

```javascript
const channel = exp.getChannel('myChannel', { system: false, consumer: false });
```

Use ```system: true``` to get a system channel. You cannot send messages on a system channels but can listen for system notifications, such as updates to API resources.

Use ```consumer: true``` to get a consumer channel. Consumer devices can only listen or broadcast on consumer channels. When ```consumer: false``` you will not receive consumer device broadcasts and consumer devices will not be able to hear your broadcasts.

Both ```system``` and ```consumer``` default to ```false```. Consumer devices will be unable to broadcast or listen to messages on non-consumer channels.


### Broadcasting

Use the broadcast method of a channel object to send a named message containing an optional JSON serializable payload to other entities on the EXP network. You can optionally include a timeout to wait for responses to the broadcast. The broadcast will return a promise and resolve approximately after the given timeout (milliseconds) with a ```list``` of response payloads. Each response payload can any JSON serializable type.

```javascript
exp.getChannel('myChannel').broadcast('myEvent', 'hello', 5000).then(responses => {
  responses.forEach(response => console.log(response));
});
```

### Listening

To listen for broadcasts, call the listen method of a channel object.  Pass in the name of the event you wish to listen for and a callback to handle the broadcast. The callback will receive the broadcast payload. Listen returns a promise that resolves with a listener object when listening on the network has actually started. Calling cancel on the listener object stops the callback from being executed.


```javascript

exp.getChannel('myChannel').listen('myEvent', payload => {
  console.log('Event Received!');
  console.log(payload);
}).then(listener => {
  // Remove the listener after 5 seconds.
  setTimeout(() => listener.cancel(), 5000);
});

```


### Responding

To respond to a broadcast, call the second argument of the listener callback with your response.

```javascript

exp.getChannel('my_channel').listen('my_event', (payload, respond) => {
  if (payload === 'hello!') respond('hi there!');
});

```



## Starting the SDK

The SDK is started by calling ```exp.start``` and specifying your credentials and configuration options. You may supply user, device, or consumer app credentials. You can also authenticate in pairing mode.

Users must specify their ```username```, ```password```, and ```organization```.

```javascript
exp.start({ username: 'joe@joemail.com', password: 'JoeRocks42', organization: 'joesorg' });
```

Devices must specify their ```uuid``` and ```secret``` .
```javascript
exp.start({ uuid: '[uuid]', secret: '[secret]' });
```

Consumer apps must specify their ```uuid``` and ```apiKey```.

```javascript
exp.start({ uuid: '[uuid]', apiKey: '[api key]');
```



## Advanced Options


Name | Default | Description
--- | --- | ---
host | `https://api.goexp.io` | The api server to authenticate with.
enableNetwork | `true` | Whether to enable real time network communication. If set to `false` you will be unable to listen on the EXP network.
allowPairing | `false` | Whether or not to allow the SDK to run in pairing mode.


# API Resources

# The EXP Network

# Advanced Topics

## Context Based Memory Management

A ```context``` is a string that can be used to track event listener registration. A copy of an instance of the SDK can be created by calling ```clone(context)``` method. This will return a cloned instance of the SDK bound to the given context. Calling ```clear(context)``` on any SDK instance derived from the original would remove all event listeners registered by the SDK instance bound to that context. This feature is generally intended for use by player apps, but it provides a simple interface to memory management of event listeners and can help reduce the chances of memory leaks due to orphaned event listener registrations in complex or long lived applications.

In this example, a module starts the SDK, and exports two cloned instances of the SDK bound to different contexts. After some interval, we clear all the event listeners bound to one of the context:

```javascript
const exp = require('exp-sdk');

exp.start(options);
exp1 = exp.clone('context 1')
exp2 = exp.clone('context 2');

exp1.getChannel('myChannelName').listen('myEventName', () => {});
exp2.getChannel('myChannelName').listen('myEventName', () => {});

exp2.clear(); // Unregisters all callbacks and listerers attached by exp2.

```

Note that calling ```stop``` on a cloned SDK instance or the original sdk instance stops the sdk for the original and all derived clones.


## Using Multiple Instances of the SDK

Calling ```exp.fork()``` will return an unstarted instance of the sdk.

```javascript

const exp = require('exp-sdk');
const exp2 = exp.fork();

exp.start(options1);
exp2.start(options2)

exp.stop();
exp2.stop();

```


Context based memory management is also supported when using multiple instances of the SDK, but unique names must be used for each context as event listeners are registered in a global pool.

```javascript
const exp = require('exp-sdk');
const sdk1 = exp.start(options1);
const sdk2 = exp.start(options2);
sdk1A = sdk1.clone('A');
sdk1B = sdk1.clone('B');
sdk2A = sdk2.clone('A');

sdk2.clear('A'); // Also clears sdk1A!

```
