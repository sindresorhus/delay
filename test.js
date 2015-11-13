import test from 'ava';
import fn from './';

test('promise', async t => {
	const date = Date.now();
	await fn(50);
	const diff = Date.now() - date;
	t.true(diff > 30 && diff < 70);
});

test('thunk', async t => {
	const date = Date.now();
	var result = await Promise.resolve('foo').then(fn(50));
	const diff = Date.now() - date;
	t.true(diff > 30 && diff < 80);
	t.is(result, 'foo');
});
