'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Transformer, Circle, Text } from 'react-konva'
import { createYjsRoom } from '@/lib/yjs'
import { Tool } from '@/components/toolbar/tools'

type SceneNode = {
    id: string
    type: 'rect'
    x: number
    y: number
    width: number
    height: number
}

export default function Canvas({
    activeTool,
    roomId,
    user,
}: {
    activeTool: Tool
    roomId: string
    user: any
}) {
    const stageRef = useRef<any>(null)
    const transformerRef = useRef<any>(null)

    const [nodes, setNodes] = useState<SceneNode[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [drawingNode, setDrawingNode] =
        useState<SceneNode | null>(null)
    const [cursors, setCursors] = useState<any[]>([])
    const [size, setSize] = useState({ width: 0, height: 0 })

    const { yNodes, provider, undoManager } =
        createYjsRoom(roomId)

    // -----------------------------
    // YJS SYNC
    // -----------------------------
    useEffect(() => {
        const update = () => {
            const synced: SceneNode[] = []
            yNodes.forEach((v: any) => synced.push(v))
            setNodes(synced)
        }

        update()
        yNodes.observe(update)

        return () => yNodes.unobserve(update)
    }, [])

    const syncNode = (node: SceneNode) =>
        yNodes.set(node.id, node)

    const deleteNodes = (ids: string[]) => {
        ids.forEach((id) => yNodes.delete(id))
    }

    // -----------------------------
    // AWARENESS (CURSORS FIXED)
    // -----------------------------
    useEffect(() => {
        const awareness = provider.awareness

        // Set local user info
        awareness.setLocalStateField('user', {
            name: user?.displayName || 'User',
            color:
                '#' +
                Math.floor(Math.random() * 16777215).toString(16),
        })

        const update = () => {
            const states = Array.from(
                awareness.getStates().entries()
            )

            const mapped = states
                .filter(
                    ([clientId]) =>
                        clientId !== awareness.clientID
                )
                .map(([clientId, state]: any) => ({
                    clientId,
                    ...state,
                }))

            setCursors(mapped)
        }

        awareness.on('change', update)
        update()

        return () => awareness.off('change', update)
    }, [provider, user])

    const updateCursor = (pos: any) => {
        provider.awareness.setLocalStateField(
            'cursor',
            pos
        )
    }

    // -----------------------------
    // RESPONSIVE
    // -----------------------------
    useEffect(() => {
        const updateSize = () =>
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })

        updateSize()
        window.addEventListener('resize', updateSize)
        return () =>
            window.removeEventListener('resize', updateSize)
    }, [])

    // -----------------------------
    // UNDO / REDO (YJS)
    // -----------------------------
    useEffect(() => {
        const key = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault()
                e.shiftKey
                    ? undoManager.redo()
                    : undoManager.undo()
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault()
                deleteNodes(selectedIds)
                setSelectedIds([])
            }
        }

        window.addEventListener('keydown', key)
        return () =>
            window.removeEventListener('keydown', key)
    }, [selectedIds])

    // -----------------------------
    // TRANSFORMER ATTACH
    // -----------------------------
    useEffect(() => {
        if (!transformerRef.current || !stageRef.current) return

        const stage = stageRef.current
        const selectedNodes = selectedIds
            .map((id) => stage.findOne(`#${id}`))
            .filter(Boolean)

        transformerRef.current.nodes(selectedNodes)
        transformerRef.current.getLayer().batchDraw()
    }, [selectedIds, nodes])

    // -----------------------------
    // DRAWING
    // -----------------------------
    const handleMouseDown = (e: any) => {
        if (e.target === e.target.getStage()) {
            setSelectedIds([])
        }

        if (activeTool !== 'draw') return

        const pos = stageRef.current?.getPointerPosition()
        if (!pos) return

        setDrawingNode({
            id: crypto.randomUUID(),
            type: 'rect',
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
        })
    }

    const handleMouseMove = () => {
        const pos = stageRef.current?.getPointerPosition()
        if (!pos) return

        updateCursor(pos)

        if (!drawingNode || activeTool !== 'draw') return

        setDrawingNode({
            ...drawingNode,
            width: pos.x - drawingNode.x,
            height: pos.y - drawingNode.y,
        })
    }

    const handleMouseUp = () => {
        if (!drawingNode) return
        syncNode(drawingNode)
        setDrawingNode(null)
    }

    // -----------------------------
    // DRAG
    // -----------------------------
    const handleDragEnd = (id: string, e: any) => {
        const { x, y } = e.target.position()
        const node = nodes.find((n) => n.id === id)
        if (!node) return
        syncNode({ ...node, x, y })
    }

    // -----------------------------
    // RESIZE
    // -----------------------------
    const handleTransformEnd = () => {
        transformerRef.current.nodes().forEach((node: any) => {
            const id = node.id()
            const scaleX = node.scaleX()
            const scaleY = node.scaleY()

            node.scaleX(1)
            node.scaleY(1)

            const original = nodes.find((n) => n.id === id)
            if (!original) return

            syncNode({
                ...original,
                x: node.x(),
                y: node.y(),
                width: Math.max(5, original.width * scaleX),
                height: Math.max(5, original.height * scaleY),
            })
        })
    }

    if (size.width === 0) return null

    return (
        <div className="flex-1 bg-white relative">
            {/* User List Overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm shadow-xl border border-gray-100 px-4 py-3 rounded-xl z-50 min-w-[140px]">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-semibold text-gray-800 text-sm tracking-wide uppercase">Collaborators</span>
                </div>
                <div className="space-y-2">
                    {/* Local User */}
                    <div className="text-sm flex items-center gap-3 bg-blue-50/50 p-1.5 rounded-lg border border-blue-100/50">
                        <div
                            className="w-2.5 h-2.5 rounded-full shadow-sm"
                            style={{ background: user?.color || '#3b82f6' }}
                        />
                        <span className="font-medium text-blue-900">{user?.displayName} (You)</span>
                    </div>
                    {/* Remote Users */}
                    {cursors.map((c: any) => (
                        <div
                            key={c.clientId}
                            className="text-sm flex items-center gap-3 px-1.5 py-1"
                        >
                            <div
                                className="w-2.5 h-2.5 rounded-full shadow-sm"
                                style={{ background: c.user?.color || '#94a3b8' }}
                            />
                            <span className="text-gray-600 italic">
                                {c.user?.name || 'Anonymous User'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <Stage
                ref={stageRef}
                width={size.width}
                height={size.height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>
                    {nodes.map((node) => (
                        <ShapeRenderer
                            key={node.id}
                            node={node}
                            activeTool={activeTool}
                            isSelected={selectedIds.includes(node.id)}
                            onSelect={(e?: any) => {
                                if (activeTool !== 'select') return

                                if (e?.evt?.shiftKey) {
                                    setSelectedIds((prev) =>
                                        prev.includes(node.id)
                                            ? prev.filter((id) => id !== node.id)
                                            : [...prev, node.id]
                                    )
                                } else {
                                    setSelectedIds([node.id])
                                }
                            }}
                            onDragEnd={(e) =>
                                handleDragEnd(node.id, e)
                            }
                            onTransformEnd={handleTransformEnd}
                        />
                    ))}

                    <Transformer
                        ref={transformerRef}
                        rotateEnabled={false}
                        enabledAnchors={[
                            'top-left',
                            'top-right',
                            'bottom-left',
                            'bottom-right',
                        ]}
                    />

                    {/* Multiplayer Cursors */}
                    {cursors.map((c: any) =>
                        c.cursor ? (
                            <React.Fragment key={c.clientId}>
                                <Circle
                                    x={c.cursor.x}
                                    y={c.cursor.y}
                                    radius={5}
                                    fill={c.user?.color || 'red'}
                                />
                                <Text
                                    x={c.cursor.x + 8}
                                    y={c.cursor.y}
                                    text={c.user?.name || 'User'}
                                    fontSize={12}
                                    fill={c.user?.color || 'red'}
                                />
                            </React.Fragment>
                        ) : null
                    )}
                </Layer>
            </Stage>
        </div>
    )
}
