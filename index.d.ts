/// <reference lib="dom"/>

export interface ClearablePromise<T> extends Promise<T> {
	/**
	 * Clears the delay and settles the promise.
	 */
	clear(): void;
}

export interface Options {
	/**
	 * An optional AbortSignal to abort the delay.
	 * If aborted, the Promise will be rejected with an AbortError.
	 */
	signal?: AbortSignal
}

declare const delay: {
	/**
	 * Create a promise which resolves after the specified `milliseconds`.
	 *
	 * @param milliseconds - Milliseconds to delay the promise.
	 * @returns A promise which resolves after the specified `milliseconds`.
	 */
	(milliseconds: number, options?: Options): ClearablePromise<void>;

	/**
	 * Create a promise which resolves after the specified `milliseconds`.
	 *
	 * @param milliseconds - Milliseconds to delay the promise.
	 * @returns A promise which resolves after the specified `milliseconds`.
	 */
	<T>(milliseconds: number, options?: Options & {
		/** Value to resolve in the returned promise. */
		value: T
	}): ClearablePromise<T>;

	/**
	 * Create a promise which rejects after the specified `milliseconds`.
	 *
	 * @param milliseconds - Milliseconds to delay the promise.
	 * @returns A promise which rejects after the specified `milliseconds`.
	 */
	// TODO: Allow providing value type after https://github.com/Microsoft/TypeScript/issues/5413 will be resolved.
	reject(milliseconds: number, options?: Options & {
		/** Value to reject in the returned promise. */
		value?: any
	}): ClearablePromise<never>;
};

export default delay;
