'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const createRoom = () => {
    const id = crypto.randomUUID()
    router.push(`/session/${id}`)
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
          Collaborative <span className="text-blue-600">Whiteboard</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Create a room and invite others to brainstorm together in real-time.
        </p>
        <button
          onClick={createRoom}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          Create Whiteboard
        </button>
      </div>
    </div>
  )
}
