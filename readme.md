# delay [![Build Status](https://travis-ci.org/sindresorhus/delay.svg?branch=master)](https://travis-ci.org/sindresorhus/delay)

> Delay a promise a specified amount of time


## Install

```
$ npm install delay
```


## Usage

```js
const delay = require('delay');

(async () => {
	bar();

	await delay(100);

	// Executed 100 milliseconds later
	baz();
})();
```


## Advanced usage

```js
const delay = require('delay');

delay(100, 'a result')
	.then(result => {
		// Executed after 100 milliseconds
		// result === 'a result';
	});

// There's also `delay.reject()` which optionally accepts a value and rejects it `ms` later
delay.reject(100, 'foo'))
	.then(x => blah()) // Never executed
	.catch(err => {
		// Executed 100 milliseconds later
		// err === 'foo'
	});

// You can settle the delay by calling `.clear()`
(async () => {
	const delayedPromise = delay(1000, 'done!');

	setTimeout(() => {
		delayedPromise.clear();
	}, 500);

	const result = await delayedPromise;
	// 500 milliseconds later
	// result === 'done!'
})();
```


## API

### delay(ms, [value])

Create a promise which resolves after the specified `ms`. Optionally pass a
`value` to resolve.

### delay.reject(ms, [value])

Create a promise which rejects after the specified `ms`. Optionally pass a
`value` to reject.

#### ms

Type: `number`

Milliseconds to delay the promise.

#### value

Type: `any`

Value to resolve or reject in the returned promise.

### delay#clear()

Clears the delay and settles the promise.


## Related

- [delay-cli](https://github.com/sindresorhus/delay-cli) - CLI for this module
- [p-cancelable](https://github.com/sindresorhus/p-cancelable) - Create a promise that can be canceled
- [p-min-delay](https://github.com/sindresorhus/p-min-delay) - Delay a promise a minimum amount of time
- [p-immediate](https://github.com/sindresorhus/p-immediate) - Returns a promise resolved in the next event loop - think `setImmediate()`
- [p-timeout](https://github.com/sindresorhus/p-timeout) - Timeout a promise after a specified amount of time
- [More…](https://github.com/sindresorhus/promise-fun)


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
