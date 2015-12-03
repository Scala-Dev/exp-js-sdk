'use strict';

const Channel = require('./channel');
const socket = require('./socket');

const channels = {};

class Bus {

 getChannel (name) {
   if (channels[name]) return channels[name];
   const channel = new Channel(name);
   channels[name] = channel;
   return channel;
 }

}

socket.events.on('message', message => {
  if (message.version !== 2) return;
  if (!channels[message.channel]) return;
  channels[message.channel].onMessageReceived(message);
});

module.exports = new Bus();
