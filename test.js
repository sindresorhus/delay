import test from 'ava';
import timeSpan from 'time-span';
import inRange from 'in-range';
import fn from './';

test('promise', async t => {
	const end = timeSpan();
	await fn(50);
	t.true(inRange(end(), 30, 70), 'is delayed');
});

test('thunk', async t => {
	const end = timeSpan();
	const result = await Promise.resolve('foo').then(fn(50));
	t.true(inRange(end(), 30, 70), 'is delayed');
	t.is(result, 'foo', 'passes through the value');
});

test('.reject() with two arguments', async t => {
	const end = timeSpan();
	await t.throws(fn.reject(50, new Error('foo')), 'foo', 'promise is rejected with the second argument');
	t.true(inRange(end(), 30, 70), 'is delayed');
});

test('.reject() with two arguments (as a thunk)', async t => {
	const end = timeSpan();
	await t.throws(
		Promise.resolve('foo').then(fn.reject(50, new Error('bar'))),
		'bar',
		'promise is rejected with the resolution value'
	);
	t.true(inRange(end(), 30, 70), 'is delayed');
});

test('.reject() with one argument (thunk)', async t => {
	const end = timeSpan();
	await t.throws(
		Promise.resolve(new Error('foo')).then(fn.reject(50)),
		'foo',
		'promise is rejected with the resolution value'
	);
	t.true(inRange(end(), 30, 70), 'is delayed');
});
