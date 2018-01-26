elvjs
=====

A small but powerful event emitter for JavaScript and TypeScript

## Installation

  ``npm i elvjs --save``

## Documentation

* [API Reference](https://github.com/Mehuge/elvjs/wiki)

## Basic Usage

### TypeScript

  ```TypeScript
  import events from 'elvjs';
  const handler = events.on('test-event', (...args) => {
    console.log('test-event fired', ...args);
  });
  events.fire('test-event', 1);
  events.fire('test-event', 1, 2);
  events.fire('test-event', 1, 2, 3);
  events.off(handler);
  ```

### Nodejs (es6)

  ```JavaScript
  const { events } = require("elvjs");
  const handler = events.on('test-event', function (...args) {
    console.log('test-event fired', ...args);
  });
  events.fire('test-event', 1);
  events.fire('test-event', 1, 2);
  events.fire('test-event', 1, 2, 3);
  events.off(handler);
  ```


### Nodejs (es5)

  ```JavaScript
  var events = require("elvjs").events;
  var handler = events.on('test-event', function () {
    console.log('test-event fired', Array.prototype.join.call(arguments,' '));
  });
  events.fire('test-event', 1);
  events.fire('test-event', 1, 2);
  events.fire('test-event', 1, 2, 3);
  events.off(handler);
  ```

## Tests

  ```npm test```

## Release History

* 1.0.8 Documentation Update
* 1.0.7 First complete release
* 1.0.0 Initial release
