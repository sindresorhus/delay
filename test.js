'use strict';
import test from 'ava';
import fn from './';

// need to use serial, or timings get messed up.

test.serial(async t => {
	const date = Date.now();
	await fn(50);
	const diff = Date.now() - date;
	t.true(diff > 30 && diff < 70);
});

test.serial(t => {
	const date = Date.now();
	fn(50).then(fn(50)).then(() => {
		const diff = Date.now() - date;
		t.true(diff > 80 && diff < 140);
		t.end();
	});
});
