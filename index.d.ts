interface ClearablePromise<T> extends Promise<T> {
  clear (): void
}

declare const delay: {
  <T = never>(ms: number, value?: T): ClearablePromise<T>
  reject(ms: number, reason?: any): ClearablePromise<never>
}

export = delay
