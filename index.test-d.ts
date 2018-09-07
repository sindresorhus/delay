import {expectType} from 'tsd-check';
import delay from '.';

expectType<void>(await delay(200));

expectType<string>(await delay(200, {value: '🦄'}));
expectType<number>(await delay(200, {value: 0}));

expectType<never>(await delay.reject(200, {value: '🦄'}));
expectType<never>(await delay.reject(200, {value: 0}));
