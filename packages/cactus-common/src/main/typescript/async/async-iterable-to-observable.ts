import { Observable, Subscriber } from "rxjs";

async function noAwaitLoop<T>(
  iterable: AsyncIterable<T>,
  observer: Subscriber<T>,
) {
  try {
    for await (const item of iterable) {
      if (observer.closed) {
        return;
      }
      observer.next(item);
    }
    observer.complete();
  } catch (e) {
    observer.error(e);
  }
}

export function asyncIterableToObservable<T>(
  iterable: AsyncIterable<T>,
): Observable<T> {
  return new Observable<T>((observer: Subscriber<T>) => {
    noAwaitLoop(iterable, observer);
  });
}
