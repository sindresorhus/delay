# delay [![Build Status](https://travis-ci.org/sindresorhus/delay.svg?branch=master)](https://travis-ci.org/sindresorhus/delay)

> Delay a promise a specified amount of time


## Install

```
$ npm install --save delay
```


## Usage

```js
const delay = require('delay');

delay(200)
	.then(() => {
		// executed after 200 milliseconds
	});

somePromise()
	.then(delay(100))
	.then(result => {
		// executed 100 milliseconds after somePromise resolves
		// the result from somePromise is passed through
	});

// and with Babel and async functions
async () => {
	bar();

	await delay(100);

	// executed 100 milliseconds later
	baz();
}();

// there's also delay.reject() that takes the value, and rejects it `ms` later
Promise.resolve('foo')
	.then(delay.reject(100))
	.then(x => blah()) // never executed
	.catch(err => {
		// executed 100 milliseconds later
		// err === 'foo'
	});

// you can also specify the rejection value
Promise.resolve('foo')
	.then(delay.reject(100, 'bar'))
	.then(x => blah()) // never executed
	.catch(err => {
		// executed 100 milliseconds later
		// err === 'bar'
	});
```


## Related

- [immediate-promise](https://github.com/sindresorhus/immediate-promise) - Returns a promise resolved in the next event loop - think `setImmediate()`


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
