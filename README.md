
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
  - [Content](#content)
  - [Data](#data)
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



## Feeds
 | Description
 --- | ---
`exp.getFeed(uuid)` | Resolves to the feed with given uuid or `null`.
`exp.findFeeds(params)` | Resolves to an array of feeds matching the given query parameters.
`exp.createFeed(document)` | Resolves to a newly created feed.
`feed.document` | The location's underlying document.
`feed.refresh()` | Resolves when the feed is refreshed. The document is updated in place.
`feed.save()` | Resolves when the feed is saved. The document is updated in place.
`feed.getChannel(options)` | Returns the [channel](#channel) for this feed with the given [channel options](#channel-options).
`feed.fling(payload, options, timeout)` | Sends fling event on feed's [channel](#channel) with given [channel options](#channel-options) and broadcast `timeout`.
`feed.getData()` | Resolves to the feeds data. See the [documentation](https://docs.goexp.io).


## Content
 | Description
 --- | ---
`exp.getContent(uuid)` | Resolves to the content item with given uuid or `null`.
`exp.findContent(params)` | Resolves to an array of content items matching the given query parameters.
`content.document` | The location's underlying document.
`content.getChannel(options)` | Returns the [channel](#channel) for this content with the given [channel options](#channel-options).
`content.fling(payload, options, timeout)` | Sends fling event on content's [channel](#channel) with given [channel options](#channel-options) and broadcast `timeout`.
`content.getUrl()` | Returns the delivery URL for the content.
`content.getChildren()` | Resolves to an array of the content item's children.
`content.hasVariant(name)` | Returns `true` if the specified variant is available, and `false` if the variant does not exist.
`content.getVariantUrl()` | Returns the delivery URL of the variant. Throws an error if variant does not exists.
`content.subtype` | The subtype of the content.


## Data
 | Description
 --- | ---
`exp.getData(key, group)` | Resolves to the data item with given key and group. Group defaults to `default`. If the data item does not exist, resolves to data item with `value` of `null`.
query parameters.
`exp.findData(params)` | Resolves to an array of data items matching the given query parameters.
`exp.createData(key, group, value)` | Resolves to a newly created data item.
`exp.createData(key, value)` | Resolves to a newly created data item in group `default`.
`data.refresh()` | Resolves when the data item value is refreshed in place.
`data.value` | The value of the data item.
`data.save()` | Resolves when the data item is saved.
`data.document` | The data item's underlying document.
`data.getChannel(options)` | Returns the [channel](#channel) for this data item with the given [channel options](#channel-options).
`data.fling(payload, options, timeout)` | Sends fling event on data item's [channel](#channel) with given [channel options](#channel-options) and broadcast `timeout`.



## Startup Options
Name | Description
--- | ---
**USER CREDENTIALS** |
username | Your username.
password | Your password.
organization | Organization to authenticate into.
**Device Credentials** |
uuid | The device uuid.
secret | The device secret.
allowPairing | Whether or not to allow the SDK to run in pairing mode. Defaults to `false`.
**Consumer App Credentials** |
uuid | The consumer app uuid.
apiKey | The consumer app api key.
**Other Options**
host | The api server to authenticate with. Defaults to `https://api.goexp.io`.
enableNetwork | Whether to enable real time network communication. If set to `false` you will be unable to listen on the EXP network. Defaults to `true`.




## Channel Options
Name | Description
--- | ---
`system` | Whether or not the channel is a system channel. Defaults to `false`.
`consumer` | Whether or not the channel is a consumer channel. Defaults to `false`. Consumer apps can only use channels with `consumer=true`.



