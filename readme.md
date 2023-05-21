# delay

> Delay a promise a specified amount of time

*If you target Node.js 16 or later, you can use `import {setTimeout} from 'node:timers/promises'; await setTimeout(1000);` instead. This package can still be useful if you need browser support or the extra features.*

## Install

```sh
npm install delay
```

## Usage

```js
import delay from 'delay';

bar();

await delay(100);

// Executed 100 milliseconds later
baz();
```

## API

### delay(milliseconds, options?) <sup>default import</sup>

Create a promise which resolves after the specified `milliseconds`.

### rangeDelay(minimum, maximum, options?)

Create a promise which resolves after a random amount of milliseconds between `minimum` and `maximum` has passed.

Useful for tests and web scraping since they can have unpredictable performance. For example, if you have a test that asserts a method should not take longer than a certain amount of time, and then run it on a CI, it could take longer. So with this method, you could give it a threshold instead.

#### milliseconds
#### mininum
#### maximum

Type: `number`

Milliseconds to delay the promise.

#### options

Type: `object`

##### value

Type: `unknown`

A value to resolve in the returned promise.

```js
import delay from 'delay';

const result = await delay(100, {value: '🦄'});

// Executed after 100 milliseconds
console.log(result);
//=> '🦄'
```

##### signal

Type: [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

The returned promise will be rejected with an `AbortError` if the signal is aborted.

```js
import delay from 'delay';

const abortController = new AbortController();

setTimeout(() => {
	abortController.abort();
}, 500);

try {
	await delay(1000, {signal: abortController.signal});
} catch (error) {
	// 500 milliseconds later
	console.log(error.name)
	//=> 'AbortError'
}
```

### clearDelay(delayPromise)

Clears the delay and settles the promise.

If you pass in a promise that is already cleared or a promise coming from somewhere else, it does nothing.

```js
import delay, {clearDelay} from 'delay';

const delayedPromise = delay(1000, {value: 'Done'});

setTimeout(() => {
	clearDelay(delayedPromise);
}, 500);

// 500 milliseconds later
console.log(await delayedPromise);
//=> 'Done'
```

### createDelay({clearTimeout, setTimeout})

Creates a new `delay` instance using the provided functions for clearing and setting timeouts. Useful if you're about to stub timers globally, but you still want to use `delay` to manage your tests.

```js
import {createDelay} from 'delay';

const customDelay = createDelay({clearTimeout, setTimeout});

const result = await customDelay(100, {value: '🦄'});

// Executed after 100 milliseconds
console.log(result);
//=> '🦄'
```

## Related

- [delay-cli](https://github.com/sindresorhus/delay-cli) - CLI for this module
- [p-cancelable](https://github.com/sindresorhus/p-cancelable) - Create a promise that can be canceled
- [p-min-delay](https://github.com/sindresorhus/p-min-delay) - Delay a promise a minimum amount of time
- [p-immediate](https://github.com/sindresorhus/p-immediate) - Returns a promise resolved in the next event loop - think `setImmediate()`
- [p-timeout](https://github.com/sindresorhus/p-timeout) - Timeout a promise after a specified amount of time
- [More…](https://github.com/sindresorhus/promise-fun)
