'use strict';

const createDelay = willResolve => (ms, value) => {
	let timeoutId;
	let settle;

	const delayPromise = new Promise((resolve, reject) => {
		settle = willResolve ? resolve : reject;
		timeoutId = setTimeout(settle, ms, value);
	});

	delayPromise.clear = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
			settle(value);
		}
	};

	return delayPromise;
};

module.exports = createDelay(true);
module.exports.reject = createDelay(false);
