import test from 'ava';
import fn from './';

test(async t => {
	const date = Date.now();
	await fn(50);
	const diff = Date.now() - date;
	t.true(diff > 30 && diff < 70);
});
