export function dragable(el: HTMLElement, lockX = false, lockY = false) {
    let seedX: number, seedY: number, ox: number, oy: number
    function _onmMove(e: MouseEvent) {
        const dx = e.x - seedX
        const dy = e.y - seedY
        !lockX && (el.style.left = (ox + dx) + 'px')
        !lockY && (el.style.top = (oy + dy) + 'px')
    }
    function _onDown(e: MouseEvent) {
        console.log(e.target, el)
        if (e.target !== el) return
        seedX = e.x
        seedY = e.y
        ox = parseInt(getComputedStyle(el).left)
        oy = parseInt(getComputedStyle(el).top)
        document.addEventListener('mousemove', _onmMove)
        document.addEventListener('mouseup',_onUp)
    }
    function _onUp() {
        document.removeEventListener('mousemove', _onmMove)
    }
    el.addEventListener('mousedown', _onDown)
}


export function zoomable(el: HTMLElement, speed = 0.005) {
    let scale = 1
    let transX = 0
    let transY = 0
    // 获取鼠标在屏幕位置
    el.onwheel = function(e: WheelEvent) {
        // 计算当前鼠标在画布的位置
        scale += e.deltaY * -0.005

        // restrict
        scale = Math.max(0.5, Math.min(2, scale))
        el.style.transform = `scale(${scale})`
        // el.style.marginTop = `${(scale - 1) * 50}vh`
        // el.style.marginLeft = `${(scale - 1) * 50}vw`
    }
}