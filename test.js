import test from 'ava';
import timeSpan from 'time-span';
import inRange from 'in-range';
import fn from './';

test('promise', async t => {
	t.plan(1);
	const end = timeSpan();
	await fn(50);
	t.true(inRange(end(), 30, 70), 'should be delayed');
});

test('thunk', async t => {
	t.plan(2);
	const end = timeSpan();
	const result = await Promise.resolve('foo').then(fn(50));
	t.true(inRange(end(), 30, 70), 'should be delayed');
	t.is(result, 'foo', 'should pass through the value');
});

test.cb('.reject with two arguments', t => {
	t.plan(2);
	const error = new Error('foo');
	const end = timeSpan();
	fn.reject(50, error)
		.catch(err => {
			t.true(inRange(end(), 30, 70), 'should be delayed');
			t.is(err, error, 'promise should be rejected with the second argument');
			t.end();
		});
});

test.cb('.reject with one argument (thunk)', t => {
	t.plan(2);
	const val = 'foo';
	const end = timeSpan();
	Promise.resolve(val)
		.then(fn.reject(50))
		.catch(err => {
			t.true(inRange(end(), 30, 70), 'should be delayed');
			t.is(err, val, 'promise should be rejected with the resolved value');
			t.end();
		});
});
