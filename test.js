import {serial as test} from 'ava';
import timeSpan from 'time-span';
import inRange from 'in-range';
import currentlyUnhandled from 'currently-unhandled';
import {AbortController} from 'abort-controller';
import delay from '.';

const getCurrentlyUnhandled = currentlyUnhandled();

test('returns a resolved promise', async t => {
	const end = timeSpan();
	await delay(50);
	t.true(inRange(end(), 30, 70), 'is delayed');
});

test('returns a rejected promise', async t => {
	const end = timeSpan();
	await t.throwsAsync(
		delay.reject(50, {value: new Error('foo')}),
		'foo'
	);
	t.true(inRange(end(), 30, 70), 'is delayed');
});

test('able to resolve a falsy value', async t => {
	t.is(
		await delay(50, {value: 0}),
		0
	);
});

test('able to reject a falsy value', async t => {
	t.plan(1);
	try {
		await delay.reject(50, {value: false});
	} catch (error) {
		t.is(error, false);
	}
});

test('delay defaults to 0 ms', async t => {
	const end = timeSpan();
	await delay();
	t.true(end() < 30);
});

test('reject will cause an unhandledRejection if not caught', async t => {
	const reason = new Error('foo');
	const promise = delay.reject(0, {value: reason});

	await delay(10);

	t.deepEqual(getCurrentlyUnhandled(), [{
		reason,
		promise
	}], 'Promise should be unhandled');

	promise.catch(() => {});
	await delay(10);

	t.deepEqual(getCurrentlyUnhandled(), [], 'no unhandled rejections now');
});

test('can clear a delayed resolution', async t => {
	const end = timeSpan();
	const delayPromise = delay(1000, {value: 'success!'});

	delayPromise.clear();
	const success = await delayPromise;

	t.true(end() < 30);
	t.is(success, 'success!');
});

test('can clear a delayed rejection', async t => {
	const end = timeSpan();
	const delayPromise = delay.reject(1000, {value: new Error('error!')});
	delayPromise.clear();

	await t.throwsAsync(delayPromise, /error!/);
	t.true(end() < 30);
});

test('resolution can be aborted with an AbortSignal', async t => {
	const end = timeSpan();
	const abortController = new AbortController();
	setTimeout(() => abortController.abort(), 1);
	await t.throwsAsync(
		delay(1000, {signal: abortController.signal}),
		{name: 'AbortError'}
	);
	t.true(end() < 30);
});

test('resolution can be aborted with an AbortSignal if a value is passed', async t => {
	const end = timeSpan();
	const abortController = new AbortController();
	setTimeout(() => abortController.abort(), 1);
	await t.throwsAsync(
		delay(1000, {value: 123, signal: abortController.signal}),
		{name: 'AbortError'}
	);
	t.true(end() < 30);
});

test('rejection can be aborted with an AbortSignal if a value is passed', async t => {
	const end = timeSpan();
	const abortController = new AbortController();
	setTimeout(() => abortController.abort(), 1);
	await t.throwsAsync(
		delay.reject(1000, {value: new Error(), signal: abortController.signal}),
		{name: 'AbortError'}
	);
	t.true(end() < 30);
});

test('rejects with AbortError if AbortSignal is already aborted', async t => {
	const end = timeSpan();
	const abortController = new AbortController();
	abortController.abort();
	await t.throwsAsync(
		delay(1000, {signal: abortController.signal}),
		{name: 'AbortError'}
	);
	t.true(end() < 30);
});

test('returns a promise that is resolved in a random range of time', async t => {
	const end = timeSpan();
	await delay.range(50, 150);
	t.true(inRange(end(), 30, 170), 'is delayed');
});

test('can create a new instance with fixed timeout methods', async t => {
	const cleared = [];
	const callbacks = [];
	const custom = delay.createWithTimers({
		clearTimeout(handle) {
			cleared.push(handle);
		},

		setTimeout(callback, ms) {
			const handle = Symbol('handle');
			callbacks.push({callback, handle, ms});
			return handle;
		}
	});

	const first = custom(50, {value: 'first'});
	t.is(callbacks.length, 1);
	t.is(callbacks[0].ms, 50);
	callbacks[0].callback();
	t.is(await first, 'first');

	const second = custom.reject(40, {value: 'second'});
	t.is(callbacks.length, 2);
	t.is(callbacks[1].ms, 40);
	callbacks[1].callback();
	try {
		await second;
	} catch (error) {
		t.is(error, 'second');
	}

	const third = custom(60);
	t.is(callbacks.length, 3);
	t.is(callbacks[2].ms, 60);
	third.clear();
	t.is(cleared.length, 1);
	t.is(cleared[0], callbacks[2].handle);

	const fourth = custom.range(50, 150, {value: 'fourth'});
	t.is(callbacks.length, 4);
	t.true(inRange(callbacks[2].ms, 50, 150));
	callbacks[3].callback();
	t.is(await fourth, 'fourth');
});
