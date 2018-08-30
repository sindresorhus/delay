import {serial as test} from 'ava';
import timeSpan from 'time-span';
import inRange from 'in-range';
import currentlyUnhandled from 'currently-unhandled';
import {AbortController} from 'abort-controller';
import m from '.';

const getCurrentlyUnhandled = currentlyUnhandled();

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
	const promise = m.reject(0, reason);

	await m(10);

	t.deepEqual(getCurrentlyUnhandled(), [{
		reason,
		promise
	}], 'Promise should be unhandled');

	promise.catch(() => {});
	await m(10);

	t.deepEqual(getCurrentlyUnhandled(), [], 'no unhandled rejections now');
});

test('can clear a delayed resolution', async t => {
	const end = timeSpan();
	const delayPromise = m(1000, 'success!');

	delayPromise.clear();
	const success = await delayPromise;

	t.true(end() < 30);
	t.is(success, 'success!');
});

test('can clear a delayed rejection', async t => {
	const end = timeSpan();
	const delayPromise = m.reject(1000, 'error!');
	delayPromise.clear();

	await t.throws(delayPromise, /error!/);
	t.true(end() < 30);
});

test('resolution can be aborted with an AbortSignal as second parameter', async t => {
	const end = timeSpan();
	try {
		const abortController = new AbortController();
		setTimeout(() => abortController.abort(), 1);
		await m(1000, abortController.signal);
		t.fail('Expected to reject');
	} catch (err) {
		t.is(err.name, 'AbortError');
		t.true(end() < 30);
	}
});

test('resolution can be aborted with an AbortSignal as third parameter', async t => {
	const end = timeSpan();
	try {
		const abortController = new AbortController();
		setTimeout(() => abortController.abort(), 1);
		await m(1000, 'value', abortController.signal);
		t.fail('Expected to reject');
	} catch (err) {
		t.is(err.name, 'AbortError');
		t.true(end() < 30);
	}
});

test('rejects with AbortError if AbortSignal is already aborted', async t => {
	const end = timeSpan();
	try {
		const abortController = new AbortController();
		abortController.abort();
		await m(1000, abortController.signal);
		t.fail('Expected to reject');
	} catch (err) {
		t.is(err.name, 'AbortError');
		t.true(end() < 30);
	}
});
