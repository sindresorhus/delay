import test from 'node:test';
import assert from 'node:assert/strict';
import timeSpan from 'time-span';
import inRange from 'in-range';
import delay, {clearDelay, rangeDelay, createDelay} from './index.js';

test('returns a resolved promise', async () => {
	const end = timeSpan();
	await delay(50);
	assert.ok(inRange(end(), {start: 30, end: 70}), 'is delayed');
});

test('able to resolve a falsy value', async () => {
	assert.strictEqual(
		await delay(50, {value: 0}),
		0,
	);
});

test('delay defaults to 0 ms', async () => {
	const end = timeSpan();
	await delay();
	assert.ok(end() < 30);
});

test('can clear a delayed resolution', async () => {
	const end = timeSpan();
	const delayPromise = delay(1000, {value: 'success!'});

	clearDelay(delayPromise);
	const success = await delayPromise;

	assert.ok(end() < 30);
	assert.strictEqual(success, 'success!');
});

test('resolution can be aborted with an AbortSignal', async () => {
	const end = timeSpan();
	const abortController = new AbortController();

	setTimeout(() => {
		abortController.abort();
	}, 1);

	await assert.rejects(
		delay(1000, {signal: abortController.signal}),
		{name: 'AbortError'},
	);

	assert.ok(end() < 30);
});

test('resolution can be aborted with an AbortSignal if a value is passed', async () => {
	const end = timeSpan();
	const abortController = new AbortController();

	setTimeout(() => {
		abortController.abort();
	}, 1);

	await assert.rejects(
		delay(1000, {value: 123, signal: abortController.signal}),
		{name: 'AbortError'},
	);

	assert.ok(end() < 30);
});

test('rejects with AbortError if AbortSignal is already aborted', async () => {
	const end = timeSpan();

	const abortController = new AbortController();
	abortController.abort();

	await assert.rejects(
		delay(1000, {signal: abortController.signal}),
		{name: 'AbortError'},
	);

	assert.ok(end() < 30);
});

test('returns a promise that is resolved in a random range of time', async () => {
	const end = timeSpan();
	await rangeDelay(50, 150);
	assert.ok(inRange(end(), {start: 30, end: 170}), 'is delayed');
});

test('can create a new instance with fixed timeout methods', async () => {
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
	assert.strictEqual(callbacks.length, 1);
	assert.strictEqual(callbacks[0].ms, 50);
	callbacks[0].callback();
	assert.strictEqual(await first, 'first');

	const second = custom(40, {value: 'second'});
	assert.strictEqual(callbacks.length, 2);
	assert.strictEqual(callbacks[1].ms, 40);
	callbacks[1].callback();
	assert.strictEqual(await second, 'second');

	const third = custom(60);
	assert.strictEqual(callbacks.length, 3);
	assert.strictEqual(callbacks[2].ms, 60);
	clearDelay(third);
	assert.strictEqual(cleared.length, 1);
	assert.strictEqual(cleared[0], callbacks[2].handle);
});
