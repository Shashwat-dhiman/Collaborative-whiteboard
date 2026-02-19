export type RectNode = {
    id: string
    type: 'rect'
    x: number
    y: number
    width: number
    height: number
}

export type GroupNode = {
    id: string
    type: 'group'
    x: number
    y: number
    width: number
    height: number
    children: string[]
}

export type SceneNode = RectNode | GroupNode

export function addNode(
    nodes: SceneNode[],
    node: SceneNode
): SceneNode[] {
    return [...nodes, node]
}

export function updateNode(
    nodes: SceneNode[],
    id: string,
    updates: Partial<SceneNode>
): SceneNode[] {
    return nodes.map((node) =>
        node.id === id ? ({ ...node, ...updates } as SceneNode) : node
    )
}

export function removeNode(
    nodes: SceneNode[],
    id: string
): SceneNode[] {
    return nodes.filter((node) => node.id !== id)
}
