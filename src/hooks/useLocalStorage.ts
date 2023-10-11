import { useState } from "react"

export default function useLocalStorage<T>(key: string, init: T): [
    s: T,
    ss: (v: T) => void,
] {
    if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(init))
    }
    const [state, setState] = useState<T>(JSON.parse(localStorage.getItem(key) as string) as T)
    return [
        state,
        (val: T) => {
            setState(val)
            localStorage.setItem(key, JSON.stringify(val))
        }
    ]
}