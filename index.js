'use strict';

class CancelError extends Error {
	constructor(message) {
		super(message);
		this.name = 'CancelError';
	}
}

const createDelay = willResolve => (ms, value) => {
	let timeoutId;
	let internalReject;

	const delayPromise = new Promise((resolve, reject) => {
		internalReject = reject;

		timeoutId = setTimeout(() => {
			const settle = willResolve ? resolve : reject;
			settle(value);
		}, ms);
	});

	delayPromise.cancel = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
			internalReject(new CancelError('Delay canceled'));
		}
	};

	return delayPromise;
};

module.exports = createDelay(true);
module.exports.reject = createDelay(false);
module.exports.CancelError = CancelError;
