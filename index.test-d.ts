import {expectType} from 'tsd-check';
import delay from '.';

(async () => {
	expectType<void>(await delay(200));

	expectType<string>(await delay(200, '🦄'));
	expectType<number>(await delay(200, 0));

	expectType<never>(await delay.reject(200, '🦄'));
	expectType<never>(await delay.reject(200, 0));
})();
