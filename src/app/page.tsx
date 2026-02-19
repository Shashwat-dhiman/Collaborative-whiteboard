'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'
import Toolbar from '@/components/toolbar/Toolbar'
import { Tool } from '@/components/toolbar/tools'

const Canvas = dynamic(
  () => import('@/components/canvas/Canvas'),
  { ssr: false }
)

export default function Home() {
  const [activeTool, setActiveTool] = useState<Tool>('draw')

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Toolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />
        <Canvas activeTool={activeTool} />
      </div>
    </div>
  )
}
