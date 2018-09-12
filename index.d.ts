/// <reference lib="dom"/>

type Omit<Interface, Properties extends keyof Interface> = Pick<Interface, Exclude<keyof Interface, Properties>>;

export interface ClearablePromise<T> extends Promise<T> {
	/**
	 * Clears the delay and settles the promise.
	 */
	clear(): void;
}

export interface Options<Value = any> {
	/**
	 * An optional AbortSignal to abort the delay.
	 * If aborted, the Promise will be rejected with an AbortError.
	 */
	signal?: AbortSignal,
	/**
	 * Value to resolve in the returned promise.
	 */
	value: Value
}

declare const delay: {
	/**
	 * Create a promise which resolves after the specified `milliseconds`.
	 *
	 * @param milliseconds - Milliseconds to delay the promise.
	 * @returns A promise which resolves after the specified `milliseconds`.
	 */
	(milliseconds: number, options?: Omit<Options, 'value'>): ClearablePromise<void>;

	/**
	 * Create a promise which resolves after the specified `milliseconds`.
	 *
	 * @param milliseconds - Milliseconds to delay the promise.
	 * @returns A promise which resolves after the specified `milliseconds`.
	 */
	<Value>(milliseconds: number, options?: Options<Value>): ClearablePromise<Value>;

	/**
	 * Create a promise which rejects after the specified `milliseconds`.
	 *
	 * @param milliseconds - Milliseconds to delay the promise.
	 * @returns A promise which rejects after the specified `milliseconds`.
	 */
	// TODO: Allow providing value type after https://github.com/Microsoft/TypeScript/issues/5413 will be resolved.
	reject(milliseconds: number, options?: Options): ClearablePromise<never>;
};

export default delay;
