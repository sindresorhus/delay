# delay [![Build Status](https://travis-ci.org/sindresorhus/delay.svg?branch=master)](https://travis-ci.org/sindresorhus/delay)

> Delay a promise a specified amount of time


## Install

```
$ npm install --save delay
```


## Usage

```js
const delay = require('delay');

somePromise()
	.then(delay(100))
	.then(() => {
		// executed after 100 milliseconds
	});
```


## Related

- [immediate-promise](https://github.com/sindresorhus/immediate-promise) - Returns a promise resolved in the next event loop - think `setImmediate()`


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
