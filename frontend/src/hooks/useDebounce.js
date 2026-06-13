import { useState, useEffect } from 'react'

/**
 * Debounces a value by the given delay in milliseconds.
 * Useful for search inputs to avoid firing on every keystroke.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}
