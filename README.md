# Getting Started

The SDK is started by calling ```exp.start``` and specifying your credentials and configuration options. You may supply user, device, or consumer app credentials. You can also authenticate in pairing mode. When the promise returned by ```exp.start``` resolves, you are authenticated and can begin using the SDK. 

Users must specify their ```username```, ```password```, and ```organization```.

```javascript
exp.start({ username: 'joe@joemail.com', password: 'JoeRocks42', organization: 'joesorg' }).then(() => {});
```

Devices must specify their ```uuid``` and ```secret``` .
```javascript
exp.start({ uuid: '[uuid]', secret: '[secret]' })
```

Consumer apps must specify their ```uuid``` and ```apiKey```.

```javascript
exp.start({ uuid: '[uuid]', apiKey: '[api key]')
```

Advanced users can authenticate in pairing mode by setting ```allow_pairing``` to ```False```.

```python
exp.start({ allow_pairing=False })
```

Additional options:

Name | Default | Description
--- | --- | ---
host | ```'https://api.goexp.io'``` | The api server to authenticate with.
enable_network | ```true``` | Whether to enable real time network communication. If set to ```true``` you will be unable to listen on the EXP network.







# Reference

## Runtime

- ```exp.start(options)```: Start/configure the SDK. Returns a promise that resovles when authenticated.
- ```exp.getAuth()```: Resolves to current latest authentication response from server.
- ```exp.isConnected```: Whether or not you are connected to the EXP network.
- ```exp.on('online', callback)```: Callback is called when connection to EXP network is established.
- ```exp.on('update', callback)```: Callback is called when authentication changes.
- ```exp.on('offline', callback)```: Callback is called when connection to EXP network is lost.
- ```exp.on('error', callback)```: Callback is called when a fatal error occurs.


## Devices
- ```exp.getDevice(uuid)```: Resolves to device with given uuid. 
- ```exp.findDevices(params)```: Resolves to an array of matching devices. Params is a dictionary of query params. See the API docs. 
- ```exp.createDevice(document)```: Resolves to an unsaved device.
- ```device.save()```: Saves or updates the device.
- ```device.refresh()```: Refreshes the device.
- ```device.uuid```: The device's uuid.
- ```device.document```: The device's underlying document.
- ```device.getChannel(options)```: Returns a channel for communication about the device. See [Channels](#channels).

## Things
- ```exp.getThing(uuid)```: Resolves to the thing with the given uuid.
- ```exp.findThings(params)```: Resolves to an array of matching things. Params is a dictionary of query params. See the API docs. 
- ```exp.createThing(document)```: Resolves to an unsaved thing.
- ```thing.save()```: Saves or updates the thing.
- ```thing.refresh()```: Refreshes the thing.
- ```thing.uuid```: The thing's uuid.
- ```thing.document```: The thing's underlying document.
- ```thing.getChannel(options)```: Returns a channel for communication about the thing. See [Channels](#channels).

## Experiences
- ```exp.getExperience(uuid)```: Resolves to the experience with the given uuid.
- ```exp.findExperiences(params)```: Resolves to an array of matching experiences. Params is a dictionary of query params. See the API docs. 
- ```exp.createExperience(document)```: Resolves to an unsaved experience.
- ```experience.save()```: Saves or updates the experience.
- ```experience.refresh()```: Refreshes the experience.
- ```experience.uuid```: The experience's uuid.
- ```experience.document```: The experience's underlying document.
- ```experience.getChannel(options)```: Returns a channel for communication about the experience. See [Channels](#channels).

## Locations
- ```exp.getLocation(uuid)```: Resolves to the location with the given uuid.
- ```exp.findLocations(params)```: Resolves to an array of matching locations. Params is a dictionary of query params. See the API docs. 
- ```exp.createLocation(document)```: Resolves to an unsaved location.
- ```location.save()```: Saves or updates the location.
- ```location.refresh()```: Refreshes the location.
- ```location.uuid```: The location's uuid.
- ```location.document```: The location's underlying document.
- ```location.getChannel(options)```: Returns a channel for communication about the location. See [Channels](#channels).
- ```location.getZones()```: Returns a promise that resolves to an array of the location's zones.

## Feeds
- ```exp.getFeed(uuid)```: Resolves to the feed with the given uuid.
- ```exp.findFeeds(params)```: Resolves to an array of matching feeds. Params is a dictionary of query params. See the API docs.
- ```exp.createFeed(document)```: Resolves to an unsaved feed.
- ```feed.save()```: Saves or updates the feed.
- ```feed.refresh()```: Refreshes the feed.
- ```feed.uuid```
- ```feed.document```
- ```feed.getChannel(options)```: Returns a channel for communication about the feed. See [Channels](#channels).

## Zones
- ```zone.document```: The zone's underlying document.
- ```zone.getChannel(options)```: Returns a channel for communications about the zone. See [Channels](#channels).
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


## Channels
- ```exp.getChannel(name, options)```: Returns a channel. Options is an object that can have system: true/false and consumer true/false.
- ```channel.listen(name, callback)```: Returns a promise that resolves to a [listener](#listeners) when the listener is registered. Callback is called when a broadcast for the named event is received. Callback is passed the payload of the broadcast and a response callback that, when called, can be passed the response to the broadcast.
- ```channel.broadcast(name, payload, timeout)```: Returns a promise that resolves to a list of responses to the broadcast. Request will wait for responses for the given timeout. 

## Listeners
- ```listener.cancel()```: Cancels the registered callback associated with the listener.

## Exceptions


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

