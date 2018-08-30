'use strict';

const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};

const isAbortSignal = value =>
	typeof value === 'object' &&
	value !== null &&
	typeof value.aborted === 'boolean' &&
	typeof value.addEventListener === 'function';

const createDelay = willResolve => (ms, value, signal) => {
	if (isAbortSignal(value)) {
		signal = value;
		value = undefined;
	}
	if (signal && signal.aborted) {
		return Promise.reject(createAbortError());
	}

	let timeoutId;
	let settle;
	let rejectFn;

	const delayPromise = new Promise((resolve, reject) => {
		settle = willResolve ? resolve : reject;
		rejectFn = reject;
		timeoutId = setTimeout(settle, ms, value);
	});

	if (signal) {
		signal.addEventListener('abort', () => {
			clearTimeout(timeoutId);
			rejectFn(createAbortError());
		});
	}

	delayPromise.clear = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
			settle(value);
		}
	};

	return delayPromise;
};

const delay = createDelay(true);
delay.reject = createDelay(false);
module.exports = delay;
module.exports.default = delay;
