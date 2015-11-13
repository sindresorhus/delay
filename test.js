'use strict';

import test from 'ava';
import delay from './';

test(async t => {
	const date = Date.now();
	await delay(50);
	const diff = Date.now() - date;
	t.true(diff > 30 && diff < 70);
});

test(async t => {
	const date = Date.now();
	var result = await Promise.resolve('foo').then(delay(50));
	const diff = Date.now() - date;
	t.true(diff > 30 && diff < 80);
	t.is(result, 'foo');
});
