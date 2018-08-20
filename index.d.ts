interface ClearablePromise<T> extends Promise<T> {
 /**
  * Clears the delay and settles the promise.
  *
  * @memberof ClearablePromise
  */
  clear(): void;
}

declare const delay: {
  /**
    * Create a promise which resolves after the specified `milliseconds`.
    * Optionally pass a `value` to resolve.
    *
    * @param {number} milliseconds Milliseconds to delay the promise.
    * @param {T} [value] Value to resolve in the returned promise.
    * @returns {ClearablePromise<T>} a promise which resolves after the specified `milliseconds`
    */
  <T = never>(milliseconds: number, value?: T): ClearablePromise<T>;
  
  /**
    * Create a promise which rejects after the specified `milliseconds`.
    * Optionally pass a `reason` to reject.
    *
    * @param {number} milliseconds Milliseconds to delay the promise.
    * @param {*} [reason] Value to reject in the returned promise.
    * @returns {ClearablePromise<never>} a promise which rejects after the specified `milliseconds`.
    */
  reject(milliseconds: number, reason?: any): ClearablePromise<never>;
};

export default delay;
