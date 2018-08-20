interface ClearablePromise<T> extends Promise<T> {
	/**
	 * Clears the delay and settles the promise.
	 */
	clear(): void;
}

declare const delay: {
	/**
	 * Create a promise which resolves after the specified `milliseconds`.
	 *
	 * @param milliseconds - Milliseconds to delay the promise.
	 * @returns A promise which resolves after the specified `milliseconds`.
	 */
	(milliseconds: number): ClearablePromise<void>;

	/**
	 * Create a promise which resolves after the specified `milliseconds`.
	 *
	 * @param milliseconds - Milliseconds to delay the promise.
	 * @param value - Value to resolve in the returned promise.
	 * @returns A promise which resolves after the specified `milliseconds`.
	 */
	<T>(milliseconds: number, value: T): ClearablePromise<T>;

	/**
	 * Create a promise which rejects after the specified `milliseconds`.
	 *
	 * @param milliseconds - Milliseconds to delay the promise.
	 * @param reason - Value to reject in the returned promise.
	 * @returns A promise which rejects after the specified `milliseconds`.
	 */
	// TODO: Allow providing reason type after https://github.com/Microsoft/TypeScript/issues/5413 will be resolved.
	reject(milliseconds: number, reason?: any): ClearablePromise<never>;
};

export default delay;
