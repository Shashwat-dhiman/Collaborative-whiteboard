import { useState } from 'react'

export function useHistory<T>(initialState: T) {
    const [history, setHistory] = useState<T[]>([initialState])
    const [index, setIndex] = useState(0)

    const current = history[index]

    const set = (newState: T) => {
        const updatedHistory = history.slice(0, index + 1)
        setHistory([...updatedHistory, newState])
        setIndex(updatedHistory.length)
    }

    const undo = () => {
        if (index > 0) {
            setIndex(index - 1)
        }
    }

    const redo = () => {
        if (index < history.length - 1) {
            setIndex(index + 1)
        }
    }

    const canUndo = index > 0
    const canRedo = index < history.length - 1

    return {
        state: current,
        set,
        undo,
        redo,
        canUndo,
        canRedo,
    }
}
