'use strict';
module.exports = function (ms) {
	return function delay(result) {
		return new Promise(function (resolve) {
			setTimeout(function () {
				resolve(result);
			}, ms || 0);
		});
	};
};
