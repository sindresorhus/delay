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
	 * @param signal - An optional AbortSignal to abort the delay. If aborted, the Promise will be rejected with an AbortError.
	 * @returns A promise which resolves after the specified `milliseconds`.
	 */
	(milliseconds: number, signal?: AbortSignal): ClearablePromise<void>;

	/**
	 * Create a promise which resolves after the specified `milliseconds`.
	 *
	 * @param milliseconds - Milliseconds to delay the promise.
	 * @param value - Value to resolve in the returned promise.
	 * @param signal - An optional AbortSignal to abort the delay. If aborted, the Promise will be rejected with an AbortError.
	 * @returns A promise which resolves after the specified `milliseconds`.
	 */
	<T>(milliseconds: number, value: T, signal?: AbortSignal): ClearablePromise<T>;

	/**
	 * Create a promise which rejects after the specified `milliseconds`.
	 *
	 * @param milliseconds - Milliseconds to delay the promise.
	 * @param reason - Value to reject in the returned promise.
	 * @param signal - An optional AbortSignal to abort the delay. If aborted, the Promise will be rejected with an AbortError.
	 * @returns A promise which rejects after the specified `milliseconds`.
	 */
	// TODO: Allow providing reason type after https://github.com/Microsoft/TypeScript/issues/5413 will be resolved.
	reject(milliseconds: number, reason?: any, signal?: AbortSignal): ClearablePromise<never>;
};

export default delay;
