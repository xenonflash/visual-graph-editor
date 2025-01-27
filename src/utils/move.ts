import { useStore } from '../store'

interface Position {
    x: number
    y: number
}

// 拖动功能
export function dragable(el: HTMLElement) {
    const store = useStore()
    let isDragging = false
    let startPos: Position = { x: 0, y: 0 }
    let startTransform = { x: 0, y: 0 }

    el.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.button !== 0) return // 只响应左键
        isDragging = true
        startPos = { x: e.clientX, y: e.clientY }
        startTransform = { 
            x: store.transform.x, 
            y: store.transform.y 
        }
        el.style.cursor = 'grabbing'
    })

    document.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isDragging) return
        
        const dx = e.clientX - startPos.x
        const dy = e.clientY - startPos.y
        
        store.updateTransform({
            x: startTransform.x + dx,
            y: startTransform.y + dy
        })
        
        updateTransform(el)
    })

    document.addEventListener('mouseup', () => {
        isDragging = false
        el.style.cursor = 'grab'
    })
}

// 缩放功能
export function zoomable(containerEl: HTMLElement, targetEl: HTMLElement) {
    const store = useStore()
    const MIN_SCALE = 0.1
    const MAX_SCALE = 3
    const WHEEL_ZOOM_SPEED = 0.1

    // 鼠标滚轮缩放
    containerEl.addEventListener('wheel', (e: WheelEvent) => {
        e.preventDefault()
        
        // 获取鼠标相对于容器的位置
        const rect = containerEl.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        // 获取当前变换状态
        const { scale, x, y } = store.transform
        
        // 计算鼠标相对于画布原点的位置（考虑当前缩放和平移）
        const pointX = (mouseX - x) / scale
        const pointY = (mouseY - y) / scale

        // 计算新的缩放值
        const delta = e.deltaY > 0 ? -WHEEL_ZOOM_SPEED : WHEEL_ZOOM_SPEED
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * (1 + delta)))
        
        if (newScale !== scale) {
            // 计算新的平移值，保持鼠标指向的点不变
            const newX = mouseX - pointX * newScale
            const newY = mouseY - pointY * newScale
            
            // 更新变换状态
            store.updateTransform({
                scale: newScale,
                x: newX,
                y: newY
            })
            
            // 触发缩放更新事件
            const event = new CustomEvent('zoom', { 
                detail: { scale: newScale } 
            })
            containerEl.dispatchEvent(event)
        }
    })

    // 触摸缩放
    let initialDistance = 0
    let initialScale = 1
    let initialCenter = { x: 0, y: 0 }
    let initialTransform = { x: 0, y: 0 }

    containerEl.addEventListener('touchstart', (e: TouchEvent) => {
        if (e.touches.length !== 2) return
        
        e.preventDefault()
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        
        initialDistance = getDistance(touch1, touch2)
        initialScale = store.transform.scale
        initialCenter = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        }
        initialTransform = {
            x: store.transform.x,
            y: store.transform.y
        }
    })

    containerEl.addEventListener('touchmove', (e: TouchEvent) => {
        if (e.touches.length !== 2) return
        
        e.preventDefault()
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        
        // 计算新的缩放值
        const currentDistance = getDistance(touch1, touch2)
        const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, 
            initialScale * (currentDistance / initialDistance)
        ))
        
        // 计算新的中心点
        const center = {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        }
        
        // 计算新的平移值
        const dx = center.x - initialCenter.x
        const dy = center.y - initialCenter.y
        
        // 更新变换状态
        store.updateTransform({
            scale,
            x: initialTransform.x + dx,
            y: initialTransform.y + dy
        })
        
        // 触发缩放更新事件
        const event = new CustomEvent('zoom', { 
            detail: { scale } 
        })
        containerEl.dispatchEvent(event)
    })
}

// 更新元素变换
function updateTransform(el: HTMLElement) {
    const store = useStore()
    el.style.transform = `translate(${store.transform.x}px, ${store.transform.y}px) scale(${store.transform.scale})`
}

// 计算两个触摸点之间的距离
function getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
}

// 获取当前变换状态
export function getCurrentTransform(): Transform {
    const store = useStore()
    return { ...store.transform }
}

// 设置变换状态
export function setTransform(transform: Transform, el: HTMLElement) {
    const store = useStore()
    store.updateTransform(transform)
    updateTransform(el)
}

interface Transform {
    x: number
    y: number
    scale: number
}