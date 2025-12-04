//#region Common types

export type UnaryFn<X, R> = (x: X) => R | Promise<R>;
export type BinaryFn<X, Y, R> = (x: X, y: Y) => R | Promise<R>;

export type AnyIterable<T> = Iterable<T> | AsyncIterable<T>;

//#endregion

//#region Iterable utilities

// prettier-ignore
export type ValueType<I extends AnyIterable<any>>
  = I extends AnyIterable<infer T> ? T : never;

export const forEach = <T>(f: UnaryFn<T, any>) =>
  async function* (it: AnyIterable<T>): AsyncIterable<T> {
    for await (const t of it) {
      await f(t);
      yield t;
    }
  };

export const map = <S, T>(f: UnaryFn<S, T>) =>
  async function* (it: AnyIterable<S>): AsyncIterable<T> {
    for await (const s of it) yield await f(s);
  };

export const flatMap = <S, T>(f: UnaryFn<S, AnyIterable<T>>) =>
  async function* (it: AnyIterable<S>): AsyncIterable<T> {
    for await (const s of it) yield* await f(s);
  };

export const filter = <T>(f: UnaryFn<T, boolean>) =>
  async function* (it: AnyIterable<T>): AsyncIterable<T> {
    for await (const t of it) if (await f(t)) yield t;
  };

export const assertNotNull = async function* <T>(
  it: AnyIterable<T | null | undefined>
): AsyncIterable<T> {
  for await (const t of it) {
    if (t == null) throw new TypeError();
    yield t;
  }
};

export const acc = <A, T>(a: A, f: BinaryFn<A, T, A>) =>
  async function* (it: AnyIterable<T>): AsyncIterable<A> {
    let val = a;
    for await (const t of it) yield (val = await f(val, t));
  };

export const reduce =
  <A, T>(a: A, f: BinaryFn<A, T, A>) =>
  async (it: AnyIterable<T>) => {
    let val = a;
    for await (const t of it) val = await f(val, t);
    return val;
  };

export const count = reduce(0, (a) => a + 1);
export const sum = reduce(0, (a: number, x: number) => a + x);

export const collectToArray = async function <T>(it: AnyIterable<T>) {
  let a: T[] = [];
  for await (const t of it) a.push(t);
  return a;
};

export const zip = async function* <Ins extends AnyIterable<any>[]>(
  inputs: Ins
): AsyncIterable<{ [K in keyof Ins]: ValueType<Ins[K]> }> {
  let iters = inputs.map((x) =>
    (x[Symbol.asyncIterator] ?? x[Symbol.iterator])()
  );
  let allDone = false;
  while (!allDone) {
    let row: any[] = [];
    for (let iter of iters) {
      let { value, done } = await iter.next();
      row.push(value);
      if (done) allDone = true;
    }
    yield row as any;
  }
};

export const window = (n: number) =>
  async function* <T>(it: AnyIterable<T>): AsyncIterable<T[]> {
    let w: T[] = [];
    for await (const t of it) {
      if (w.length < n) w.push(t);
      else {
        w.copyWithin(0, 1);
        w[w.length - 1] = t;
        yield w;
      }
    }
  };

export const pairs = window(2) as <T>(
  it: AnyIterable<T>
) => AsyncIterable<[T, T]>;

export const takeFirst = async <T>(
  it: AnyIterable<T>
): Promise<T | undefined> => {
  for await (const t of it) return t;
  return undefined;
};

export const iterate = <T>(f: UnaryFn<T, T>) =>
  async function* (t: T): AsyncIterable<T> {
    yield t;
    while (true) yield (t = await f(t));
  };

//#endregion

//#region FP utilities

export const memo = <K, V>(f: (k: K) => V) => {
  let map = new Map<K, V>();
  return (k: K) => {
    if (!map.has(k)) map.set(k, f(k));
    return map.get(k)!;
  };
};

//#endregion

//#region Math utilities

export const abs = Math.abs;
export const trunc = Math.trunc;

export const ndigits = (x: number) => x.toString().length;
export const rem = (a: number, b: number) => ((a % b) + b) % b;

//#endregion

//#region Promise utilities

export const all: typeof Promise.all = Promise.all.bind(Promise);
export const resolve: typeof Promise.resolve = Promise.resolve.bind(Promise);

//#endregion

//#region Node.js utilities

export const nodeStdinLines = async (): Promise<AsyncIterable<string>> => {
  const ps = await import("node:process");
  const rl = await import("node:readline/promises");
  return rl.createInterface({ input: ps.stdin });
};

//#endregion
