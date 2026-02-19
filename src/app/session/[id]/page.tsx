'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Toolbar from '@/components/toolbar/Toolbar'
import { Tool } from '@/components/toolbar/tools'

const Canvas = dynamic(
    () => import('@/components/canvas/Canvas'),
    { ssr: false }
)

export default function SessionPage() {
    const { id } = useParams()
    const [user, setUser] = useState<any>(null)
    const [activeTool, setActiveTool] = useState<Tool>('draw')

    useEffect(() => {
        const randomName =
            'User-' + Math.floor(Math.random() * 1000)

        setUser({
            displayName: randomName,
        })
    }, [])

    if (!user || !id) return null

    return (
        <div className="h-full flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Toolbar
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                />
                <Canvas
                    activeTool={activeTool}
                    roomId={id as string}
                    user={user}
                />
            </div>
        </div>
    )
}
