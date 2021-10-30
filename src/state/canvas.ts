import { reactive, readonly, toRef } from 'vue'
import { Observer } from '/-/helpers'

interface stateInterface {
  el: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number,
  height: number,
  observer: Observer,
  pointer: {
    x: number,
    y: number,
    isPressed: boolean
  }
}

interface eventInterface {
  tick?: () => void
  resize?: () => void
  init?: () => void
  pointerMove?: (data: stateInterface['pointer']) => void
  pointerDown?: (data: stateInterface['pointer']) => void
  pointerUp?: (data: stateInterface['pointer']) => void
}

const state: stateInterface = reactive({
  el: undefined,
  ctx: undefined,
  observer: undefined,
  width: 0,
  height: 0,
  pointer: {
    x: 0,
    y: 0,
    isPressed: false
  }
})

function initCanvas(canvas) {
  state.el = canvas
  state.ctx = canvas.getContext('2d')
  state.observer = new Observer()

  state.observer.broadcast('init', {})

  state.el.addEventListener('mousemove', pointerMove)
  state.el.addEventListener('touchmove', pointerMove)
  state.el.addEventListener('mousedown', pointerDown)
  state.el.addEventListener('touchstart', pointerDown)
  state.el.addEventListener('mouseup', pointerUp)
  state.el.addEventListener('touchend', pointerUp)
  state.el.addEventListener('touchcancel', pointerUp)

  resizeCanvas()
  tick()
}

function resizeCanvas() {
  state.width = state.el.clientWidth
  state.height = state.el.clientHeight

  state.el.width = state.width
  state.el.height = state.height

  state.observer.broadcast('resize', {})
}

function tick() {
  state.ctx.clearRect(0, 0, state.width, state.height)
  state.observer.broadcast('tick', {})

  window.requestAnimationFrame(tick)
}

function pointerMove(e) {
  const rect = e.target.getBoundingClientRect()

  if (e.type.includes('touch')) {
    const touch = e.touches[0] || e.changedTouches[0]

    state.pointer.x = touch.pageX - rect.left
    state.pointer.y = touch.pageY - rect.top
  } else if (e.type.includes('mouse')) {
    state.pointer.x = e.clientX - rect.left
    state.pointer.y = e.clientY - rect.top
  }

  state.observer.broadcast('pointer-move', state.pointer)
}

function pointerDown() {
  state.pointer.isPressed = true

  state.observer.broadcast('pointer-down', state.pointer)
}

function pointerUp() {
  state.pointer.isPressed = false

  state.observer.broadcast('pointer-up', state.pointer)
}

function drawLine(posFrom, posTo, color?: string, width?: number) {
  state.ctx.strokeStyle = color || '#000000'
  state.ctx.lineWidth = width || 1
  state.ctx.beginPath()
  state.ctx.moveTo(posFrom.x, posFrom.y)
  state.ctx.lineTo(posTo.x, posTo.y)
  state.ctx.stroke()
}

function drawCircle(x: number, y: number, radius?: number, color?: string) {
  state.ctx.fillStyle = color || '#000000'
  state.ctx.beginPath()
  state.ctx.arc(x, y, radius, 0, 2 * Math.PI)
  state.ctx.fill()
}

function drawRect(x: number, y: number, width: number, height: number, radius = 0, color?: string) {
  if (width < 2 * radius) radius = width / 2
  if (height < 2 * radius) radius = height / 2

  state.ctx.fillStyle = color || '#000000'
  state.ctx.beginPath()
  state.ctx.moveTo(x + radius, y)
  state.ctx.arcTo(x + width, y, x + width, y + height, radius)
  state.ctx.arcTo(x + width, y + height, x, y + height, radius)
  state.ctx.arcTo(x, y + height, x, y, radius)
  state.ctx.arcTo(x, y, x + width, y, radius)
  state.ctx.closePath()
  state.ctx.fill()
}

function drawText(text: string, x: number, y: number, size: number, color?: string) {
  state.ctx.fillStyle = color || '#000000'
  state.ctx.font = `bold ${size * 0.6}px Arial`
  state.ctx.textAlign = 'center'
  state.ctx.textBaseline = 'middle'
  state.ctx.fillText(text, x, y)
}

export function useCanvas() {
  return {
    el: readonly(toRef(state, 'el')),
    ctx: readonly(toRef(state, 'ctx')),
    width: readonly(toRef(state, 'width')),
    height: readonly(toRef(state, 'height')),
    pointer: readonly(toRef(state, 'pointer')),
    observer: readonly(toRef(state, 'observer')),
    initCanvas,
    resizeCanvas,
    drawLine,
    drawCircle,
    drawRect,
    drawText,
  }
}

export function useCanvasObserver() {
  return {
    unsubscribe: () => {
      state.observer.unsubscribe()
    },
    onTick: (callback: eventInterface['tick']) => {
      state.observer.subscribe('tick', callback)
    },
    onResize: (callback: eventInterface['resize']) => {
      state.observer.subscribe('resize', callback)
    },
    onInit: (callback: eventInterface['init']) => {
      state.observer.subscribe('init', callback)
    },
    onPointerMove: (callback: eventInterface['pointerMove']) => {
      state.observer.subscribe('pointer-move', callback)
    },
    onPointerDown: (callback: eventInterface['pointerDown']) => {
      state.observer.subscribe('pointer-down', callback)
    },
    onPointerUp: (callback: eventInterface['pointerUp']) => {
      state.observer.subscribe('pointer-up', callback)
    },
  }
}
