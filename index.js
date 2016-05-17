'use strict';

function generate(willResolve) {
	return function (ms, value) {
		ms = ms || 0;

		// If supplied, the thunk will override promise results with `value`.
		var useValue = arguments.length > 1;

		var promise = thunk(value);
		thunk.then = promise.then.bind(promise);
		thunk.catch = promise.catch.bind(promise);
		thunk._actualPromise = promise;

		// Prevent unhandled rejection errors if promise is never used, and only used as a thunk
		promise.catch(function () {});

		return thunk;

		function thunk(result) {
			return new Promise(function (resolve, reject) {
				setTimeout(
					willResolve ? resolve : reject,
					ms,
					useValue ? value : result
				);
			});
		}
	};
}

module.exports = generate(true);
module.exports.reject = generate(false);
