type AwaitedResult<T> = { res: T; awaited: true };
type PromiseResult<T> = { promise: Promise<T>; awaited: false };

export async function awaitIfServer<T>(promise: Promise<T>): Promise<AwaitedResult<T> | PromiseResult<T>> {
  if (typeof window === "undefined") {
    const res = await promise;
    return { res, awaited: true };
  }

  return { promise, awaited: false };
}