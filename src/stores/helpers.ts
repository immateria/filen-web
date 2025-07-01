export type Setter<T> = (fn: T | ((prev: T) => T)) => void

export function createStoreSetter<S>(
        set: (fn: (state: S) => Partial<S>) => void
) {
        return <K extends keyof S>(key: K): Setter<S[K]> => fn => {
                set(state => ({
                        [key]: typeof fn === "function"
                                ? (fn as (prev: S[K]) => S[K])(state[key])
                                : fn
                }) as unknown as Partial<S>)
        }
}
