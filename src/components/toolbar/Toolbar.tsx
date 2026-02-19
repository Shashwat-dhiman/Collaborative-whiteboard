import { EraserIcon, PencilIcon, PlusIcon } from "lucide-react";
import { Tool } from "./tools";

type Props = {
    activeTool: Tool
    onToolChange: (tool: Tool) => void
}

export default function Toolbar({ activeTool, onToolChange }: Props) {
    return (
        <aside className="w-16 border-r bg-gray-50 flex flex-col items-center py-4 gap-3">
            <button
                onClick={() => onToolChange('draw')}
                className={`w-10 h-10 rounded flex items-center justify-center
          ${activeTool === 'draw'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
            >
                <PlusIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => onToolChange('select')}
                className={`w-10 h-10 rounded flex items-center justify-center
          ${activeTool === 'select'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
            >
                <PencilIcon className="w-5 h-5" />
            </button>
        </aside>
    );
}