'use strict';

function generate(shouldResolve) {
	return function (ms, value) {
		ms = ms || 0;

		function pickAction(resolve, reject) {
			var action = shouldResolve ? resolve : reject;

			if (arguments.length > 1) {
				action = action.bind(null, value);
			}

			return action;
		}

		var promise = new Promise(function (resolve, reject) {
			setTimeout(pickAction(resolve, reject), ms);
		});

		function thunk(result) {
			promise.catch(function () {});
			value = value || result;

			return new Promise(function (resolve, reject) {
				setTimeout(pickAction(resolve, reject), ms);
			});
		}

		thunk.then = promise.then.bind(promise);
		thunk.catch = promise.catch.bind(promise);

		return thunk;
	};
}

module.exports = generate(true);
module.exports.reject = generate(false);
