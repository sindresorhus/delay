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

// you can cancel the promise by calling .cancel()
async () => {
	const delaying = delay(1000);
	setTimeout(() => {
		delaying.cancel();
	}, 500);
	try {
		await delaying;
	} catch (err) {
		// err is an instance of delay.CancelError
	}
}();
```


## Related

- [p-min-delay](https://github.com/sindresorhus/p-min-delay) - Delay a promise a minimum amount of time
- [p-immediate](https://github.com/sindresorhus/p-immediate) - Returns a promise resolved in the next event loop - think `setImmediate()`
- [p-timeout](https://github.com/sindresorhus/p-timeout) - Timeout a promise after a specified amount of time
- [More…](https://github.com/sindresorhus/promise-fun)


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
