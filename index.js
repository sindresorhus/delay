/**
 * Delay function for JavaScript.
 * @module delay
 */

import {setTimeout as safeSetTimeout, clearTimeout as safeClearTimeout} from 'unlimited-timeout';
import randomInteger from 'random-int';

const clearMethods = new WeakMap();

/**
 * Create a delay function with custom timeout implementations.
 * @param {Object} [options] - Options for creating the delay.
 * @param {function} [options.clearTimeout] - Custom clearTimeout function.
 * @param {function} [options.setTimeout] - Custom setTimeout function.
 * @returns {Function} A delay function.
 */
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

/**
 * Wait for a specified number of milliseconds, then resolve.
 * @param {number} milliseconds - How long to wait in milliseconds.
 * @param {Object} [options] - Options for the delay.
 * @param {*} [options.value] - Value to resolve with after the delay.
 * @param {AbortSignal} [options.signal] - AbortSignal to cancel the delay.
 * @returns {Promise<*>} A promise that resolves after the specified delay.
 * @example
 * import delay from 'delay';
 * await delay(100); // waits 100ms
 * const result = await delay(200, {value: 'done'}); // waits 200ms and resolves with 'done'
 */
export default delay;

/**
 * Create a delay with a random duration between minimum and maximum.
 * @param {number} minimum - Minimum delay in milliseconds.
 * @param {number} maximum - Maximum delay in milliseconds.
 * @param {Object} [options] - Options for the delay.
 * @param {*} [options.value] - Value to resolve with after the delay.
 * @param {AbortSignal} [options.signal] - AbortSignal to cancel the delay.
 * @returns {Promise<*>} A promise that resolves after a random delay.
 */
export async function rangeDelay(minimum, maximum, options) {
	return delay(randomInteger(minimum, maximum), options);
}

/**
 * Clear a delay (prevent it from settling).
 * @param {Promise} promise - The delay promise to clear.
 * @returns {void}
 */
export function clearDelay(promise) {
	clearMethods.get(promise)?.();
}
