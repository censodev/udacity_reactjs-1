export default function useDebounce() {
    let timeout: number | null | undefined = null
    return (cb: () => void, delay: number = 500) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(cb, delay)
    }
}