import {expectType} from 'tsd';
import delay, {rangeDelay, createDelay} from './index.js';

expectType<Promise<void>>(delay(200));

expectType<Promise<string>>(delay(200, {value: '🦄'}));
expectType<Promise<number>>(delay(200, {value: 0}));
expectType<Promise<void>>(
	delay(200, {signal: new AbortController().signal}),
);

expectType<Promise<number>>(rangeDelay(50, 200, {value: 0}));

const customDelay = createDelay({clearTimeout, setTimeout});
expectType<Promise<void>>(customDelay(200));

expectType<Promise<string>>(customDelay(200, {value: '🦄'}));
expectType<Promise<number>>(customDelay(200, {value: 0}));

const unrefDelay = createDelay({
	clearTimeout,
	setTimeout(...arguments_) {
		return setTimeout(...arguments_).unref();
	},
});
