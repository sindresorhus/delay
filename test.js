import {serial as test} from 'ava';
import timeSpan from 'time-span';
import inRange from 'in-range';
// TODO: this is deprecated, switch it out with the `currently-unhandled` module
import trackRejections from 'loud-rejection/api';
import m, {CancelError} from './';

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

test('returns a thunk that delays the result of a promise (used with 1 arg)', async t => {
	const end = timeSpan();
	const result = await Promise.resolve('foo').then(m(50));
	t.true(inRange(end(), 30, 70), 'is delayed');
	t.is(result, 'foo', 'passes through the value');
});

test('returns a thunk that overrides the result of a promise (used with 2 args)', async t => {
	const end = timeSpan();
	const result = await Promise.resolve('foo').then(m(50, 'bar'));
	t.true(inRange(end(), 30, 70), 'is delayed');
	t.is(result, 'bar');
});

test('returns a thunk that can be used to delay the rejection of a promise (used with 1 arg)', async t => {
	const end = timeSpan();
	try {
		await Promise.reject(new Error('foo')).catch(m.reject(50));
		t.fail();
	} catch (err) {
		t.is(err.message, 'foo', 'promise is rejected with the resolution value');
		t.true(inRange(end(), 30, 70), 'is delayed');
	}
});

test('returns a thunk that can be used to override a promise with a rejection (used with 2 args)', async t => {
	const end = timeSpan();
	try {
		await Promise.resolve('foo').then(m.reject(50, new Error('bar')));
		t.fail();
	} catch (err) {
		t.is(err.message, 'bar', 'promise is rejected with the resolution value');
		t.true(inRange(end(), 30, 70), 'is delayed');
	}
});

test('able to supply a falsie value for resolution', async t => {
	t.is(
		await Promise.resolve(10).then(m(50, 0)),
		0
	);
});

test('able to supply a falsie value for rejection', async t => {
	t.plan(1);
	try {
		await Promise.resolve(10).then(m.reject(50, false));
	} catch (err) {
		t.is(err, false);
	}
});

test('delay defaults to 0', async t => {
	const end = timeSpan();
	t.is(await Promise.resolve('foo').then(m()), 'foo');
	t.true(end() < 30);
});

test('reject will cause an unhandledRejection if not used', async t => {
	const tracker = trackRejections(process);

	const reason = new Error('foo');
	let promise = m.reject(0, reason);

	await m(10);

	t.deepEqual(tracker.currentlyUnhandled(), [{
		reason,
		promise: promise._actualPromise
	}], 'promisified thunk should be unhandled');

	// using thunk should clear one, and reject another
	promise = promise();
	await m(10);

	t.deepEqual(tracker.currentlyUnhandled(), [{reason, promise}], 'thunk result should be unhandled');

	promise.catch(() => {});
	await m(10);

	t.deepEqual(tracker.currentlyUnhandled(), [], 'no unhandled rejections now');
});

test.failing('rejected.then(rejectThunk).catch(handler) - should not create unhandledRejection', async t => {
	const tracker = trackRejections(process);

	Promise.reject(new Error('foo')).then(m.reject(new Error('bar'))).catch(() => {});

	await m(10);

	t.deepEqual(tracker.currentlyUnhandled(), []);

	tracker.currentlyUnhandled().forEach(({promise}) => promise.catch(() => {}));
});

test('can be canceled', async t => {
	const delaying = m(1000);
	delaying.cancel();
	try {
		await delaying;
		t.fail();
	} catch (err) {
		t.true(err instanceof CancelError);
	}
});
