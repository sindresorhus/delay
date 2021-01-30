/// <reference lib="dom"/>
import {expectType} from 'tsd';
import delay = require('.');
import {ClearablePromise} from '.';

expectType<ClearablePromise<void>>(delay(200));

expectType<ClearablePromise<string>>(delay(200, {value: '🦄'}));
expectType<ClearablePromise<number>>(delay(200, {value: 0}));
expectType<ClearablePromise<void>>(
	delay(200, {signal: new AbortController().signal})
);

expectType<ClearablePromise<number>>(delay.range(50, 200, {value: 0}));

expectType<ClearablePromise<never>>(delay.reject(200, {value: '🦄'}));
expectType<ClearablePromise<never>>(delay.reject(200, {value: 0}));

const customDelay = delay.createWithTimers({clearTimeout, setTimeout});
expectType<ClearablePromise<void>>(customDelay(200));

expectType<ClearablePromise<string>>(customDelay(200, {value: '🦄'}));
expectType<ClearablePromise<number>>(customDelay(200, {value: 0}));

expectType<ClearablePromise<never>>(customDelay.reject(200, {value: '🦄'}));
expectType<ClearablePromise<never>>(customDelay.reject(200, {value: 0}));

const unrefDelay = delay.createWithTimers({
	clearTimeout,
	setTimeout(...args) {
		return setTimeout(...args).unref()
	},
});
