'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MessageCircle, X, Move } from 'lucide-react'

interface FloatingBallProps {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
}

export default function MediAIFloatingBall({ isExpanded, setIsExpanded }: FloatingBallProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 32, y: 32 })
  const dragStartPos = useRef({ x: 0, y: 0 })
  const ballRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const deltaX = e.clientX - dragStartPos.current.x
      const deltaY = e.clientY - dragStartPos.current.y
      
      setPosition(prev => ({
        x: Math.max(0, Math.min(window.innerWidth - 64, prev.x + deltaX)),
        y: Math.max(0, Math.min(window.innerHeight - 64, prev.y + deltaY))
      }))
      
      dragStartPos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left click
    
    setIsDragging(true)
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    e.preventDefault()
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      // If we were dragging, don't toggle expansion
      e.stopPropagation()
      return
    }
    setIsExpanded(!isExpanded)
  }

  const pulseAnimation = isHovering ? 'animate-pulse' : ''

  return (
    <div 
      ref={ballRef}
      className="fixed z-50 cursor-grab active:cursor-grabbing"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.3s ease-out'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Floating Ball */}
      <div className={`
        relative w-16 h-16 rounded-full flex items-center justify-center
        transition-all duration-300 ease-out shadow-2xl
        transform ${isHovering ? 'scale-110' : 'scale-100'} ${pulseAnimation}
        ${
          isExpanded
            ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            : 'bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700'
        }
      `}>
        {isExpanded ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        
        {/* Drag Handle */}
        <div 
          className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center"
          onMouseDown={(e) => {
            e.stopPropagation()
            handleMouseDown(e)
          }}
        >
          <Move className="w-3 h-3 text-gray-600" />
        </div>

        {/* Animated Ring */}
        {!isExpanded && (
          <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
        )}
      </div>

      {/* Tooltip */}
      {isHovering && !isExpanded && (
        <div className="absolute bottom-20 right-0 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <Move className="w-3 h-3" />
            Drag to move • Click to open
          </div>
        </div>
      )}

      {/* Quick Action Buttons */}
      {!isExpanded && (
        <div className="absolute bottom-24 right-0 flex flex-col gap-3 opacity-0 hover:opacity-100 transition-all duration-300 transform hover:translate-y-0 translate-y-4">
          <button
            className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
            title="Voice Consultation"
            aria-label="Start voice consultation"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(true)
              // You can trigger voice recording directly here
            }}
          >
            <Mic className="w-5 h-5" />
          </button>
          
          <button
            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
            title="Quick Analysis"
            aria-label="Quick medical analysis"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-bold">AI</span>
          </button>
        </div>
      )}

      {/* Connection Line (when expanded) */}
      {isExpanded && (
        <div className="absolute top-16 right-8 w-1 h-16 bg-gradient-to-b from-blue-500 to-transparent"></div>
      )}
    </div>
  )
}
