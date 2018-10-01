import {expectType} from 'tsd-check';
import delay from '.';

expectType<void>(await delay(200));

expectType<string>(await delay(200, {value: '🦄'}));
expectType<number>(await delay(200, {value: 0}));

expectType<never>(await delay.reject(200, {value: '🦄'}));
expectType<never>(await delay.reject(200, {value: 0}));

const custom = delay.createWithTimers({clearTimeout, setTimeout})
expectType<void>(await custom(200));

expectType<string>(await custom(200, {value: '🦄'}));
expectType<number>(await custom(200, {value: 0}));

expectType<never>(await custom.reject(200, {value: '🦄'}));
expectType<never>(await custom.reject(200, {value: 0}));
