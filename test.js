import test from 'ava';
import timeSpan from 'time-span';
import inRange from 'in-range';
import fn from './';

test('promise', async t => {
	const end = timeSpan();
	await fn(50);
	t.true(inRange(end(), 30, 70));
});

test('thunk', async t => {
	const end = timeSpan();
	const result = await Promise.resolve('foo').then(fn(50));
	t.true(inRange(end(), 30, 70));
	t.is(result, 'foo');
});
