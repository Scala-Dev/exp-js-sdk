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
enable_network | ```True``` | Whether to enable real time network communication. If set to ```False``` you will be unable to listen on the [EXP network](# Communicating on the EXP Network).






# Communicating on the EXP Network

The EXP network facilitates real time communication between entities connected to EXP. A user or device can broadcast a JSON serializable payload to users and devices in your organization, and listeners to those broadcasts can respond to the broadcasters.

### Channels

All messages on the EXP network are sent over a channel. Channels have a name, and two flags: ```system``` and ```consumer```.

```javascript
const channel = exp.getChannel("my_channel", { system: false, consumer: false })
```
Set ```system``` to ```true``` to get a system channel. You cannot send messages on a system channels but can listen for system notifications, such as updates to API resources.

Set ```consumer``` to ```true``` to get a consumer channel. Consumer devices can only listen or broadcast on consumer channels. When ```consumer``` is ```false``` you will not receive consumer device broadcasts and consumer devices will not be able to hear your broadcasts.

Both ```system``` and ```consumer``` default to ```false```.


### Broadcasting

Use the broadcast method of a channel object to send a named message with a JSON serializable payload to other entities on the EXP network. You can optionally include a timeout to wait for responses to the broadcast. The call will return a promise that will resolve after the given timeout (or immediately). The promise will resolve to an array of the received JSON responses to the broadcast.

```javascript
exp.getChannel("myChannel").broadcast('Hello!', [1, 2, 3], 3000).then(function (responses) {
  console.log('I got a response!')
  console.log(responses);
});
```


### Listening

To listen for broadcasts, call the listen method of a channel object. 

```javascript
channel = exp.getChannel("myChannel").listen('Hello!', function (payload) {
  console.log('I received a broadcast!');
  console.log(payload);
});
```

The listen method takes a function as the second argument. When a broadcast is received, this function will be called with the broadcast payload as the first argument.




### Responding

To respond to broadcast add a second argument to the listener callback. The second argument is a method that can be invoked with a JSON serializable variable. Invoking this method will respond to the broadcast with the given data.


```javascript
channel = exp.getChannel("myChannel").listen('Hello!', function (payload, respond) {
  console.log('I\'m going to respond!');
  respond('I got your message!');
});
```


### Full Example

```javascript

var channel = exp.getChannel('myChannel');
channel.listen('get_random_number', function (payload, respond) {
  respond(Math.random());
});

channel.broadcast('get_random_number', null, 5000).then(function (numbers) {
  console.log('Here is a list of random numbers I got from others!');
  
});


# Getting Started





# Reference

## Runtime

- exp.start(options).then(() => {});
- exp.get_auth().then(auth => {});
- exp.isConnected


## Devices
- exp.getDevice().then(device => {});
- exp.findDevices(params).then(devices => {});
- exp.createDevice(document).then(device => {});
- device.save().then(() => {});
- device.uuid

## Things

## Experiences

## Locations

## Zones

## Content

## Data

## Channels

## Exceptions


# Examples
