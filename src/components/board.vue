<template>
    <div class="board-container" ref="boardContainerEl">
        <Toolbar />
        <div class="board" ref="boardEl" :style="{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`
        }">
            <!-- 网格背景 -->
            <div class="grid-background" :style="{
                backgroundSize: `${100 * transform.scale}px ${100 * transform.scale}px, 
                                ${100 * transform.scale}px ${100 * transform.scale}px,
                                ${20 * transform.scale}px ${20 * transform.scale}px,
                                ${20 * transform.scale}px ${20 * transform.scale}px`
            }"></div>
            
            <!-- 节点 -->
            <template v-for="node in nodes" :key="node.id">
                <component 
                    :is="node.type === 'diamond' ? DiamondNode : BaseNode"
                    :node="node"
                    :isActive="node.id === activeNodeId"
                    @select="handleNodeSelect"
                />
            </template>

            <!-- 辅助线 -->
            <!-- 连线 -->
            <svg class="connections" :style="{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                overflow: 'visible'
            }">
                <path
                    v-for="line in lines"
                    :key="line.id"
                    :d="getLinePath(line)"
                    class="connection-line"
                    :class="{ 'is-active': line.id === activeLineId }"
                />
            </svg>
        </div>

        <!-- 缩放控制器 -->
        <div class="zoom-info" :class="{ 'is-visible': isZooming }">
            {{ Math.round(scale * 100) }}%
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { dragable, zoomable, getCurrentTransform } from '../utils/move'
import BaseNode from './base-node/base-node.vue'
import DiamondNode from './nodes/diamond-node.vue'
import { useStore } from '../store'
import { storeToRefs } from 'pinia'
import { ILine } from '../typings'
import Toolbar from '../components/toolbar.vue'

const store = useStore()
const { nodes, lines, activeNodeId, activeLineId, transform } = storeToRefs(store)

const boardEl = ref<HTMLElement>()
const boardContainerEl = ref<HTMLElement>()
const isZooming = ref(false)
const scale = computed(() => transform.value.scale)

let zoomTimer: number | null = null

function handleNodeSelect(nodeId: string) {
    store.setActiveNodeId(nodeId)
}

function handleZoom() {
    isZooming.value = true
    
    if (zoomTimer !== null) {
        clearTimeout(zoomTimer)
    }
    
    zoomTimer = window.setTimeout(() => {
        isZooming.value = false
    }, 1500)
}

// 生成连线路径
function getLinePath(line: ILine): string {
    const { fromX, fromY, toX, toY } = line
    
    // 计算控制点
    const dx = Math.abs(toX - fromX)
    const dy = Math.abs(toY - fromY)
    const controlLen = Math.min(dx / 2, dy / 2, 150)
    
    let cp1x = fromX
    let cp1y = fromY
    let cp2x = toX
    let cp2y = toY
    
    // 根据连接点的方向调整控制点
    switch (line.fromDot) {
        case 'l': cp1x -= controlLen; break
        case 'r': cp1x += controlLen; break
        case 't': cp1y -= controlLen; break
        case 'b': cp1y += controlLen; break
    }
    
    switch (line.toDot) {
        case 'l': cp2x -= controlLen; break
        case 'r': cp2x += controlLen; break
        case 't': cp2y -= controlLen; break
        case 'b': cp2y += controlLen; break
    }
    
    return `M ${fromX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toX} ${toY}`
}

onMounted(() => {
    if (boardEl.value && boardContainerEl.value) {
        // 初始化拖动
        dragable(boardEl.value)
        
        // 初始化缩放
        zoomable(boardContainerEl.value, boardEl.value)
        
        // 监听缩放事件
        boardContainerEl.value.addEventListener('zoom', handleZoom)
    }
})
</script>

<style lang="stylus" scoped>
.board-container {
    width: 100%
    height: 100%
    overflow: hidden
    position: relative
    cursor: grab
    
    &:active {
        cursor: grabbing
    }
}

.board {
    width: 100%
    height: 100%
    position: relative
    transform-origin: center center
}

.grid-background {
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background-color: var(--bg-primary)
    background-image: linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), 
                     linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px),
                     linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), 
                     linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
    background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px
    background-position: center center
}

.connections {
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    pointer-events: none
}

.connection-line {
    fill: none
    stroke: var(--text-secondary)
    stroke-width: 1.5
    &.is-active {
        stroke: #1890ff
        stroke-width: 2
    }
}

.zoom-info {
    position: fixed
    bottom: 24px
    left: 50%
    transform: translateX(-50%)
    background: rgba(0,0,0,0.6)
    color: #fff
    padding: 6px 12px
    border-radius: 4px
    font-size: 13px
    opacity: 0
    transition: opacity 0.2s ease
    pointer-events: none
    
    &.is-visible {
        opacity: 1
    }
}
</style>