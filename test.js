import test from 'ava';
import timeSpan from 'time-span';
import inRange from 'in-range';
import delay, {clearDelay, rangeDelay, createDelay} from './index.js';

test('returns a resolved promise', async t => {
	const end = timeSpan();
	await delay(50);
	t.true(inRange(end(), {start: 30, end: 70}), 'is delayed');
});

test('able to resolve a falsy value', async t => {
	t.is(
		await delay(50, {value: 0}),
		0,
	);
});

test('delay defaults to 0 ms', async t => {
	const end = timeSpan();
	await delay();
	t.true(end() < 30);
});

test('can clear a delayed resolution', async t => {
	const end = timeSpan();
	const delayPromise = delay(1000, {value: 'success!'});

	clearDelay(delayPromise);
	const success = await delayPromise;

	t.true(end() < 30);
	t.is(success, 'success!');
});

test('resolution can be aborted with an AbortSignal', async t => {
	const end = timeSpan();
	const abortController = new AbortController();

	setTimeout(() => {
		abortController.abort();
	}, 1);

	await t.throwsAsync(
		delay(1000, {signal: abortController.signal}),
		{name: 'AbortError'},
	);

	t.true(end() < 30);
});

test('resolution can be aborted with an AbortSignal if a value is passed', async t => {
	const end = timeSpan();
	const abortController = new AbortController();

	setTimeout(() => {
		abortController.abort();
	}, 1);

	await t.throwsAsync(
		delay(1000, {value: 123, signal: abortController.signal}),
		{name: 'AbortError'},
	);

	t.true(end() < 30);
});

test('rejects with AbortError if AbortSignal is already aborted', async t => {
	const end = timeSpan();

	const abortController = new AbortController();
	abortController.abort();

	await t.throwsAsync(
		delay(1000, {signal: abortController.signal}),
		{name: 'AbortError'},
	);

	t.true(end() < 30);
});

test('returns a promise that is resolved in a random range of time', async t => {
	const end = timeSpan();
	await rangeDelay(50, 150);
	t.true(inRange(end(), {start: 30, end: 170}), 'is delayed');
});

test('can create a new instance with fixed timeout methods', async t => {
	const cleared = [];
	const callbacks = [];

	const custom = createDelay({
		clearTimeout(handle) {
			cleared.push(handle);
		},

		setTimeout(callback, ms) {
			const handle = Symbol('handle');
			callbacks.push({callback, handle, ms});
			return handle;
		},
	});

	const first = custom(50, {value: 'first'});
	t.is(callbacks.length, 1);
	t.is(callbacks[0].ms, 50);
	callbacks[0].callback();
	t.is(await first, 'first');

	const second = custom(40, {value: 'second'});
	t.is(callbacks.length, 2);
	t.is(callbacks[1].ms, 40);
	callbacks[1].callback();
	t.is(await second, 'second');

	const third = custom(60);
	t.is(callbacks.length, 3);
	t.is(callbacks[2].ms, 60);
	clearDelay(third);
	t.is(cleared.length, 1);
	t.is(cleared[0], callbacks[2].handle);
});
