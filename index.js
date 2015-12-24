'use strict';
module.exports = function (ms) {
	ms = ms || 0;

	var promise = new Promise(function (resolve) {
		setTimeout(resolve, ms);
	});

	function thunk(result) {
		return new Promise(function (resolve) {
			setTimeout(function () {
				resolve(result);
			}, ms);
		});
	}

	thunk.then = promise.then.bind(promise);
	thunk.catch = promise.catch.bind(promise);

	return thunk;
};

module.exports.reject = function (ms, value) {
	if (arguments.length === 1) {
		return new Promise(function (resolve, reject) {
			setTimeout(reject.bind(null, value), ms);
		});
	}
	return module.exports.reject.bind(null, ms);
};
