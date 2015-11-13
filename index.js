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

	return thunk;
};
