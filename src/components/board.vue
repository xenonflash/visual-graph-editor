<template>
    <div class="board-container" ref="boardContainerEl">
        <Toolbar />
        <div class="board" ref="boardEl">
            <!-- 网格背景 -->
            <div class="grid-background"></div>
            
            <!-- 节点 -->
            <template v-for="item in nodes" :key="item.id">
                <component 
                    :is="item.type === 'diamond' ? DiamondNode : BaseNode"
                    :data="item" 
                />
            </template>

            <!-- 辅助线 -->
            <!-- 连接线 -->
            <svg class="connections">
                <defs>
                    <marker id='head' orient="auto" markerWidth='3' markerHeight='4' refX='0.1' refY='2'>
                        <path d='M0,0 V4 L2,2 Z' fill="lightblue" />
                    </marker>
                </defs>
                <path
                    v-for="line in lines"
                    :key="line.id"
                    :d="`M${line.fromX} ${line.fromY} L${line.toX} ${line.toY}`"
                    class="connection-line"
                />
            </svg>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { dragable, zoomable } from '../utils/move';
import BaseNode from './base-node/base-node.vue'
import DiamondNode from './nodes/diamond-node.vue'
import { useStore } from '../store'
import { storeToRefs } from 'pinia';
import Toolbar from '../components/toolbar.vue'

const store = useStore()
const { nodes, lines } = storeToRefs(store)

const boardEl = ref<HTMLElement>()
const boardContainerEl = ref<HTMLElement>()

onMounted(function () {
    // 设置画板全局 变换 数据到store
    setupBoardTransform()
    // dragable(boardEl.value!)
    // zoomable(boardContainerEl.value!, boardEl.value!)
})

function setupBoardTransform() {
    const { x, y, width, height } = boardEl.value!.getBoundingClientRect()
    
}

function handleBoardClick(e) {
    // 如果当前点击的不是 线段 / node 取消点击
    if(!(['base-node', 'line'].includes(e.target.dataset?.role))) {
        // 取消当前选中node
        store.setActiveNodeId()
        // 取消当前选中line
        store.setActiveLineId()
    }
}
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
    transition: all 0.2s ease
    
    &.is-active {
        stroke: #1890ff
        stroke-width: 2
    }
}
</style>