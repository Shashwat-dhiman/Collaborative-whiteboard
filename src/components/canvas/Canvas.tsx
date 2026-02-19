'use client'

import { Stage, Layer, Rect } from 'react-konva'
import { useEffect, useRef, useState } from 'react'
import { Tool } from '@/components/toolbar/tools'

type RectShape = {
    id: string
    x: number
    y: number
    width: number
    height: number
}

type Props = {
    activeTool: Tool
}

export default function Canvas({ activeTool }: Props) {
    const stageRef = useRef<any>(null)

    const [size, setSize] = useState({ width: 0, height: 0 })
    const [rects, setRects] = useState<RectShape[]>([])
    const [drawingRect, setDrawingRect] = useState<RectShape | null>(null)

    // ✅ Client-only sizing
    useEffect(() => {
        const updateSize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        updateSize()
        window.addEventListener('resize', updateSize)

        return () => window.removeEventListener('resize', updateSize)
    }, [])

    const handleMouseDown = () => {
        if (activeTool !== 'draw') return
        const pos = stageRef.current?.getPointerPosition()
        if (!pos) return

        setDrawingRect({
            id: crypto.randomUUID(),
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
        })
    }

    const handleMouseMove = () => {
        if (!drawingRect || activeTool !== 'draw') return
        const pos = stageRef.current?.getPointerPosition()
        if (!pos) return

        setDrawingRect({
            ...drawingRect,
            width: pos.x - drawingRect.x,
            height: pos.y - drawingRect.y,
        })
    }

    const handleMouseUp = () => {
        if (!drawingRect || activeTool !== 'draw') return
        setRects((prev) => [...prev, drawingRect])
        setDrawingRect(null)
    }

    if (size.width === 0) return null // prevent flash

    return (
        <div className="flex-1 bg-white">
            <Stage
                ref={stageRef}
                width={size.width}
                height={size.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>
                    {rects.map((r) => (
                        <Rect key={r.id} {...r} fill="#3b82f6" opacity={0.5} />
                    ))}
                    {drawingRect && (
                        <Rect {...drawingRect} fill="#3b82f6" opacity={0.4} />
                    )}
                </Layer>
            </Stage>
        </div>
    )
}
