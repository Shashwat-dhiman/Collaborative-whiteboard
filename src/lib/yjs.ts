import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export const createYjsRoom = (roomId: string) => {
    const ydoc = new Y.Doc()

    const provider = new WebsocketProvider(
        'wss://demos.yjs.dev',
        roomId,
        ydoc
    )

    const yNodes = ydoc.getMap('nodes')

    const undoManager = new Y.UndoManager(yNodes)

    return { ydoc, provider, yNodes, undoManager }
}
