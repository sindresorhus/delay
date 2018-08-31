'use strict';

const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};

const createDelay = willResolve => (ms, {value, signal} = {}) => {
	if (signal && signal.aborted) {
		return Promise.reject(createAbortError());
	}

	let timeoutId;
	let settle;
	let rejectFn;

	const signalListener = () => {
		clearTimeout(timeoutId);
		rejectFn(createAbortError());
	};
	const cleanup = val => {
		if (signal) {
			signal.removeEventListener('abort', signalListener);
		}
		return val;
	};

	const delayPromise = new Promise((resolve, reject) => {
		settle = willResolve ? resolve : reject;
		rejectFn = reject;
		timeoutId = setTimeout(settle, ms, value);
	}).then(cleanup, cleanup);

	if (signal) {
		signal.addEventListener('abort', signalListener, {once: true});
	}

	delayPromise.clear = () => {
		cleanup();
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
