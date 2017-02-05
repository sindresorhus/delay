'use strict';

const generate = willResolve => function (ms, value) {
	ms = ms || 0;

	// If supplied, the thunk will override promise results with `value`.
	const useValue = arguments.length > 1;

	let promise;

	const thunk = result => {
		if (promise) {
			// Prevent unhandled rejection errors if promise is never used, and only used as a thunk
			promise.catch(() => {});
		}
		return new Promise((resolve, reject) => {
			setTimeout(
				willResolve ? resolve : reject,
				ms,
				useValue ? value : result
			);
		});
	};

	promise = thunk(value);
	thunk.then = promise.then.bind(promise);
	thunk.catch = promise.catch.bind(promise);
	thunk._actualPromise = promise;

	return thunk;
};

module.exports = generate(true);
module.exports.reject = generate(false);
