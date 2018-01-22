elvjs
=====

A small but powerful event emitter for JavaScript and TypeScript

## Installation

  ``npm i elvjs --save``

## Basic Usage

### TypeScript

  ```TypeScript
  import events from 'elvjs';
  const handler = events.on('test-event', (...args) => {
    console.log('test-event fired ', ...args);
  });
  events.fire('test-event', 1);
  events.fire('test-event', 1, 2);
  events.fire('test-event', 1, 2, 3);
  events.off(handler);
  ```

## Tests

  ```npm test```

## Release History

* 1.0.0 Initial release

