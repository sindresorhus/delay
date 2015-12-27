import ava from 'ava';
import timeSpan from 'time-span';
import inRange from 'in-range';
import fn from './';

const test = ava.serial;

test('returns a resolved promise', async t => {
	const end = timeSpan();
	await fn(50);
	t.true(inRange(end(), 30, 70), 'is delayed');
});

test('returns a rejected promise', async t => {
	const end = timeSpan();
	await t.throws(
		fn.reject(50, new Error('foo')),
		'foo',
		'promise is rejected with the second argument'
	);
	t.true(inRange(end(), 30, 70), 'is delayed');
});

test('returns a thunk that delays the result of a promise (used with 1 arg)', async t => {
	const end = timeSpan();
	const result = await Promise.resolve('foo').then(fn(50));
	t.true(inRange(end(), 30, 70), 'is delayed');
	t.is(result, 'foo', 'passes through the value');
});

test('returns a thunk that overrides the result of a promise (used with 2 args)', async t => {
	const end = timeSpan();
	const result = await Promise.resolve('foo').then(fn(50, 'bar'));
	t.true(inRange(end(), 30, 70), 'is delayed');
	t.is(result, 'bar');
});

test('returns a thunk that can be used to delay the rejection of a promise (used with 1 arg)', async t => {
	const end = timeSpan();
	await t.throws(
		Promise.reject(new Error('foo')).catch(fn.reject(50)),
		'foo',
		'promise is rejected with the resolution value'
	);
	t.true(inRange(end(), 30, 70), 'is delayed');
});

test('returns a thunk that can be used to override a promise with a rejection (used with 2 args)', async t => {
	const end = timeSpan();
	await t.throws(
		Promise.resolve('foo').then(fn.reject(50, new Error('bar'))),
		'bar',
		'promise is rejected with the resolution value'
	);
	t.true(inRange(end(), 30, 70), 'is delayed');
});

test('able to supply a falsie value for resolution', async t => {
	t.is(
		await Promise.resolve(10).then(fn(50, 0)),
		0
	);
});

test('able to supply a falsie value for rejection', async t => {
	t.plan(1);
	try {
		await Promise.resolve(10).then(fn.reject(50, false));
	} catch (err) {
		t.is(err, false);
	}
});

test('delay defaults to 0', async t => {
	const end = timeSpan();
	t.is(await Promise.resolve('foo').then(fn()), 'foo');
	t.true(end() < 30);
});
