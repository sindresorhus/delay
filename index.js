'use strict';

function generate(argIndex) {
	return function (ms, value) {
		ms = ms || 0;

		// If supplied, the thunk will override promise results with `value`.
		var useValue = arguments.length > 1;

		var promise = thunk(value);
		thunk.then = promise.then.bind(promise);
		thunk.catch = promise.catch.bind(promise);
		return thunk;

		function thunk(result) {
			if (promise) {
				// Prevent unhandled rejection errors if promise is never used, and only used as a thunk
				promise.catch(function () {});
			}

			return new Promise(function () {
				// resolve / reject
				var complete = arguments[argIndex];

				setTimeout(function () {
					complete(useValue ? value : result);
				}, ms);
			});
		}
	};
}

module.exports = generate(0);
module.exports.reject = generate(1);
