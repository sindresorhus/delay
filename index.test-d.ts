import {expectType} from 'tsd-check';
import delay from '.';

expectType<void>(await delay(200));

expectType<string>(await delay(200, {value: '🦄'}));
expectType<number>(await delay(200, {value: 0}));

expectType<never>(await delay.reject(200, {value: '🦄'}));
expectType<never>(await delay.reject(200, {value: 0}));

const customDelay = delay.createWithTimers({clearTimeout, setTimeout})
expectType<void>(await customDelay(200));

expectType<string>(await customDelay(200, {value: '🦄'}));
expectType<number>(await customDelay(200, {value: 0}));

expectType<never>(await customDelay.reject(200, {value: '🦄'}));
expectType<never>(await customDelay.reject(200, {value: 0}));
