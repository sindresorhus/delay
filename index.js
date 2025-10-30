import {setTimeout as safeSetTimeout, clearTimeout as safeClearTimeout} from 'unlimited-timeout';
import randomInteger from 'random-int';

const clearMethods = new WeakMap();

export function createDelay({clearTimeout: defaultClear, setTimeout: defaultSet} = {}) {
	// We cannot use `async` here as we need the promise identity.
	return (milliseconds, {value, signal} = {}) => {
		if (signal?.aborted) {
			return Promise.reject(signal.reason);
		}

		let timeoutId;
		let settle;
		let rejectFunction;
		const clear = defaultClear ?? clearTimeout;

		const signalListener = () => {
			clear(timeoutId);
			rejectFunction(signal.reason);
		};

		const cleanup = () => {
			if (signal) {
				signal.removeEventListener('abort', signalListener);
			}
		};

		const delayPromise = new Promise((resolve, reject) => {
			settle = () => {
				cleanup();
				resolve(value);
			};

			rejectFunction = reject;
			timeoutId = (defaultSet ?? setTimeout)(settle, milliseconds);
		});

		if (signal) {
			signal.addEventListener('abort', signalListener, {once: true});
		}

		clearMethods.set(delayPromise, () => {
			clear(timeoutId);
			timeoutId = null;
			settle();
		});

		return delayPromise;
	};
}

const delay = createDelay({setTimeout: safeSetTimeout, clearTimeout: safeClearTimeout});

export default delay;

export async function rangeDelay(minimum, maximum, options) {
	return delay(randomInteger(minimum, maximum), options);
}

export function clearDelay(promise) {
	clearMethods.get(promise)?.();
}
