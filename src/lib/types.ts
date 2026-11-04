/**
 * Widens an `as const` copy object's literals to plain strings and numbers,
 * recursively, so a section component can accept any page's version of a
 * copy block (`Widen<typeof watch.busy>` takes `reviews.busy` too) while
 * keeping the shape checked. Functions and arrays pass through widened.
 */
export type Widen<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends string
    ? string
    : T extends number
      ? number
      : T extends boolean
        ? boolean
        : T extends readonly (infer U)[]
          ? readonly Widen<U>[]
          : T extends object
            ? { readonly [K in keyof T]: Widen<T[K]> }
            : T;
