import {serial as test} from 'ava';
import timeSpan from 'time-span';
import inRange from 'in-range';
import currentlyUnhandled from 'currently-unhandled';
import m, {CancelError} from './';

const getCurrentlyUnhandled = currentlyUnhandled();

// install core-js promise globally, because Node 0.12 native promises don't generate unhandledRejection events
global.Promise = Promise;

test('returns a resolved promise', async t => {
	const end = timeSpan();
	await m(50);
	t.true(inRange(end(), 30, 70), 'is delayed');
});

test('returns a rejected promise', async t => {
	const end = timeSpan();
	try {
		await m.reject(50, new Error('foo'));
		t.fail();
	} catch (err) {
		t.is(err.message, 'foo', 'promise is rejected with the second argument');
		t.true(inRange(end(), 30, 70), 'is delayed');
	}
});

test('able to resolve a falsie value', async t => {
	t.is(
		await m(50, 0),
		0
	);
});

test('able to reject a falsie value', async t => {
	t.plan(1);
	try {
		await m.reject(50, false);
	} catch (err) {
		t.is(err, false);
	}
});

test('delay defaults to 0 ms', async t => {
	const end = timeSpan();
	await m();
	t.true(end() < 30);
});

test('reject will cause an unhandledRejection if not caught', async t => {
	const reason = new Error('foo');
	let promise = m.reject(0, reason);

	await m(10);

	t.deepEqual(getCurrentlyUnhandled(), [{
		reason,
		promise
	}], 'Promise should be unhandled');

	promise.catch(() => {});
	await m(10);

	t.deepEqual(getCurrentlyUnhandled(), [], 'no unhandled rejections now');
});

test('can be canceled', async t => {
	const delayPromise = m(1000);
	delayPromise.cancel();
	await t.throws(delayPromise, CancelError);
});
