'use client'

import { Rect } from 'react-konva'
import { SceneNode } from './SceneGraph'
import { Tool } from '@/components/toolbar/tools'

type Props = {
    node: SceneNode
    activeTool: Tool
    isSelected: boolean
    onSelect: () => void
    onDragEnd: (e: any) => void
    onTransformEnd: (e: any) => void
}

export default function ShapeRenderer({
    node,
    activeTool,
    onSelect,
    onDragEnd,
    onTransformEnd,
}: Props) {
    if (node.type === 'rect') {
        return (
            <Rect
                id={node.id}
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                draggable={activeTool === 'select'}
                onClick={onSelect}
                onTap={onSelect}
                onDragEnd={onDragEnd}
                onTransformEnd={onTransformEnd}
                fill="#3b82f6"
                opacity={0.5}
            />
        )
    }

    if (node.type === 'group') {
        // Groups are handled by Transformer in Canvas.tsx or can be rendered as empty containers if needed
        return null
    }

    return null
}
