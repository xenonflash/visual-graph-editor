<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs, nextTick } from 'vue'
import { useStore } from '../../store'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { IDot, ILine, INode } from '../../typings'
import ContextMenu from '../context-menu.vue'

const store = useStore()
const { activeNodeId, hoverNodeId, hoverNode, hoverDot, transform } = storeToRefs(store)

const nodeEl = ref<HTMLElement>()

const props = defineProps<{ 
    node: INode
    isActive: boolean 
}>()
const { node } = toRefs(props)

const isHover = computed(() => hoverNodeId.value === node.value.id)
const isEditing = ref(false)
const editContent = ref('')

// 右键菜单相关
const contextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)

const contextMenuItems = computed(() => [
    {
        key: 'copy',
        label: '复制',
        icon: 'copy',
        shortcut: '⌘C',
        handler: () => {
            // 复制节点
            store.copyNode(props.node.id)
        }
    },
    {
        key: 'delete',
        label: '删除',
        icon: 'delete',
        shortcut: '⌫',
        handler: () => {
            store.removeNode(props.node.id)
        }
    }
])

const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    contextMenuX.value = e.clientX
    contextMenuY.value = e.clientY
    contextMenuVisible.value = true
}

// 双击编辑节点内容
function handleDoubleClick() {
    isEditing.value = true
    editContent.value = node.value.content
    nextTick(() => {
        const input = nodeEl.value?.querySelector('input')
        input?.focus()
    })
}

// 保存节点内容
function saveContent() {
    if (isEditing.value) {
        store.updateNodeContent(node.value.id, editContent.value)
        isEditing.value = false
    }
}

// 处理全局点击，用于保存编辑内容
function handleGlobalClick(e: MouseEvent) {
    if (!nodeEl.value?.contains(e.target as Node)) {
        saveContent()
    }
}

// 处理节点拖拽
function handleNodeMouseDown(e: MouseEvent) {
    if (e.button !== 0) return // 只响应左键
    e.stopPropagation()
    
    store.setActiveNodeId(props.node.id)
    
    const boardEl = document.querySelector('.board')
    const boardRect = boardEl?.getBoundingClientRect()
    if (!boardEl || !boardRect) return
    
    const { scale } = transform.value
    const startMousePos = { x: e.clientX, y: e.clientY }
    const startNodePos = { x: props.node.x, y: props.node.y }
    
    function handleMouseMove(e: MouseEvent) {
        const dx = (e.clientX - startMousePos.x) / scale
        const dy = (e.clientY - startMousePos.y) / scale
        
        store.updateNodePos(props.node.id, 
            startNodePos.x + dx,
            startNodePos.y + dy
        )
    }
    
    function handleMouseUp() {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
}

// 处理连接点拖拽，创建连线
function handleDotMouseDown(e: MouseEvent, dir: string) {
    e.stopPropagation()
    
    const dotEl = e.currentTarget as HTMLElement
    const nodeEl = dotEl.closest('[data-role="base-node"]') as HTMLElement
    if (!dotEl || !nodeEl) return
    
    const boardEl = document.querySelector('.board')
    const boardRect = boardEl?.getBoundingClientRect()
    if (!boardEl || !boardRect) return
    
    const { scale, x: transformX, y: transformY } = transform.value
    
    // 计算起始连接点位置
    const fromDotX = props.node.x + (dir === 'r' ? props.node.width : dir === 'l' ? 0 : props.node.width / 2)
    const fromDotY = props.node.y + (dir === 'b' ? props.node.height : dir === 't' ? 0 : props.node.height / 2)
    
    // 创建临时连线
    const tempLine: ILine = {
        id: nanoid(10),
        fromNode: props.node.id,
        toNode: '',
        fromDot: dir,
        toDot: 'l',
        fromX: fromDotX,
        fromY: fromDotY,
        toX: fromDotX,
        toY: fromDotY
    }
    store.addLine(tempLine)
    
    function handleMouseMove(e: MouseEvent) {
        const mouseX = (e.clientX - boardRect.left - transformX) / scale
        const mouseY = (e.clientY - boardRect.top - transformY) / scale
        
        store.updateLine(tempLine.id, {
            toX: mouseX,
            toY: mouseY,
            toDot: hoverDot?.value?.dir || 'l'
        })
    }
    
    function handleMouseUp() {
        const toDot = hoverDot?.value
        const toNode = hoverNode.value
        
        if (toDot && toNode) {
            const toDotX = toNode.x + (toDot.dir === 'r' ? toNode.width : toDot.dir === 'l' ? 0 : toNode.width / 2)
            const toDotY = toNode.y + (toDot.dir === 'b' ? toNode.height : toDot.dir === 't' ? 0 : toNode.height / 2)
            
            store.updateLine(tempLine.id, {
                toDot: toDot.dir,
                toX: toDotX,
                toY: toDotY,
                toNode: toNode.id
            })
        } else {
            store.removeLine(tempLine.id)
        }
        
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
}

// 处理连接点的鼠标事件
function handleDotEnter(dot: IDot) {
    store.setMouseOnDot(dot)
}

function handleDotLeave() {
    store.setMouseOnDot(null)
}

function handleNodeEnter(nodeId: string) {
    store.setMouseOnNode(nodeId)
}

function handleNodeLeave() {
    store.setMouseOnNode(undefined)
}

// 大小调整手柄位置，只保留四个角落
const resizeHandles = ['nw', 'ne', 'se', 'sw']

// 处理大小调整开始
function handleResizeStart(e: MouseEvent, handle: string) {
    e.stopPropagation()
    
    const boardEl = document.querySelector('.board')
    const boardRect = boardEl?.getBoundingClientRect()
    if (!boardEl || !boardRect) return
    
    const { scale, x: transformX, y: transformY } = transform.value
    const startMousePos = { 
        x: (e.clientX - boardRect.left - transformX) / scale,
        y: (e.clientY - boardRect.top - transformY) / scale
    }
    const startSize = { 
        width: props.node.width, 
        height: props.node.height,
        x: props.node.x,
        y: props.node.y
    }
    
    function handleMouseMove(e: MouseEvent) {
        const currentMousePos = {
            x: (e.clientX - boardRect.left - transformX) / scale,
            y: (e.clientY - boardRect.top - transformY) / scale
        }
        const dx = currentMousePos.x - startMousePos.x
        const dy = currentMousePos.y - startMousePos.y
        
        let newWidth = startSize.width
        let newHeight = startSize.height
        let newX = startSize.x
        let newY = startSize.y
        
        // 根据不同的调整手柄计算新的尺寸和位置
        if (handle.includes('e')) {
            newWidth = Math.max(60, startSize.width + dx)
        }
        if (handle.includes('w')) {
            const width = Math.max(60, startSize.width - dx)
            newX = startSize.x + startSize.width - width
            newWidth = width
        }
        if (handle.includes('s')) {
            newHeight = Math.max(40, startSize.height + dy)
        }
        if (handle.includes('n')) {
            const height = Math.max(40, startSize.height - dy)
            newY = startSize.y + startSize.height - height
            newHeight = height
        }
        
        // 更新节点尺寸
        store.updateNodeSize(props.node.id, newWidth, newHeight)
        
        // 如果位置发生变化，更新节点位置
        if (newX !== startSize.x || newY !== startSize.y) {
            store.updateNodePos(props.node.id, newX, newY)
        }
    }
    
    function handleMouseUp() {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
}

onMounted(() => {
    document.addEventListener('click', handleGlobalClick)
})

onUnmounted(() => {
    document.removeEventListener('click', handleGlobalClick)
})
</script>

<template>
    <div 
        data-role="base-node" 
        :data-node-id="props.node.id"
        class="node-container" 
        ref="nodeEl" 
        :class="{ 
            'is-active': props.isActive, 
            'is-hover': isHover,
            'has-border': props.node.type === 'default'
        }"
        :style="{
            width: props.node.width + 'px', 
            height: props.node.height + 'px',
            transform: `translate(${props.node.x}px, ${props.node.y}px)`
        }"
        @mousedown.stop="handleNodeMouseDown"
        @contextmenu.prevent="handleContextMenu"
        @mouseenter="handleNodeEnter(props.node.id)" 
        @mouseleave="handleNodeLeave()"
        @dblclick.stop="handleDoubleClick">
        <!-- 自定义形状插槽 -->
        <slot name="shape"></slot>
        <!-- 编辑状态 -->
        <template v-if="isEditing">
            <input v-model="editContent" @keyup.enter="saveContent" class="edit-input" />
        </template>
        <template v-else>
            <slot>{{ props.node.content }}</slot>
        </template>
        <!-- 连接点 -->
        <template v-if="props.isActive || isHover">
            <div v-for="dot in props.node.dots" :key="dot.dir"
                :style="{ top: dot.top + 'px', left: dot.left + 'px' }" 
                :class="`dot ${dot.dir}`"
                @mousedown.stop="handleDotMouseDown($event, dot.dir)" 
                @mouseenter.stop="handleDotEnter(dot)"
                @mouseleave.stop="handleDotLeave()">
            </div>
        </template>
        <!-- 大小调整手柄 -->
        <template v-if="props.isActive">
            <div v-for="handle in resizeHandles" 
                :key="handle"
                :class="`resize-handle ${handle}`"
                @mousedown.stop="handleResizeStart($event, handle)">
            </div>
        </template>
        <ContextMenu 
            v-model:visible="contextMenuVisible"
            :x="contextMenuX"
            :y="contextMenuY"
            :items="contextMenuItems"
            @close="contextMenuVisible = false"
        />
    </div>
</template>

<style lang="stylus" scoped>
.node-container {
    position: absolute
    border-radius: 4px
    cursor: move
    user-select: none
    display: flex
    align-items: center
    justify-content: center
    color: var(--text-primary)
    left: 0
    top: 0
    will-change: transform, width, height
    
    &.has-border {
        border: 1.5px solid #8c8c8c
        
        &:hover {
            border-color: rgba(24, 144, 255, 0.5)
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1)
        }
    }
    
    &.is-active {
        border-color: #1890ff !important
        z-index: 2
        
        .dot {
            opacity: 1
            transform: scale(1)
        }
        
        .resize-handle {
            opacity: 1
            transform: scale(1)
        }
    }
    
    &.is-hover {
        border-color: #1890ff !important
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1)
        
        .dot {
            opacity: 1
            transform: scale(1)
        }
    }
    
    .dot, .resize-handle {
        transition: opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease
    }
    
    &, &.has-border {
        transition: border-color 0.2s ease, box-shadow 0.2s ease
    }
}

.dot {
    position: absolute
    width: 12px
    height: 12px
    background: #fff
    border: 1.5px solid #1890ff
    border-radius: 50%
    opacity: 0
    z-index: 3
    transform-origin: center
    
    &.t {
        top: -7px
        left: 50%
        transform: translate(-50%, 0) scale(0.8)
        
        &:hover {
            transform: translate(-50%, 0) scale(1.2)
        }
    }
    
    &.r {
        top: 50%
        right: -7px
        transform: translate(0, -50%) scale(0.8)
        
        &:hover {
            transform: translate(0, -50%) scale(1.2)
        }
    }
    
    &.b {
        bottom: -7px
        left: 50%
        transform: translate(-50%, 0) scale(0.8)
        
        &:hover {
            transform: translate(-50%, 0) scale(1.2)
        }
    }
    
    &.l {
        top: 50%
        left: -7px
        transform: translate(0, -50%) scale(0.8)
        
        &:hover {
            transform: translate(0, -50%) scale(1.2)
        }
    }
    
    &:hover {
        background: #e6f7ff
        box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2)
    }
}

.resize-handle {
    position: absolute
    width: 12px
    height: 12px
    background: #fff
    border: 1.5px solid #ff4d4f
    border-radius: 50%
    z-index: 2
    opacity: 0
    transform: scale(0.8)
    transform-origin: center
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
    
    &:hover {
        transform: scale(1.2)
        background: #fff1f0
        box-shadow: 0 2px 6px rgba(255, 77, 79, 0.2)
    }
    
    &.nw {
        top: -12px
        left: -12px
        cursor: nw-resize
    }
    
    &.ne {
        top: -12px
        right: -12px
        cursor: ne-resize
    }
    
    &.se {
        bottom: -12px
        right: -12px
        cursor: se-resize
    }
    
    &.sw {
        bottom: -12px
        left: -12px
        cursor: sw-resize
    }
}

.edit-input {
    width: 90%
    height: 24px
    border: 1px solid #d9d9d9
    border-radius: 2px
    padding: 0 8px
    outline: none
    
    &:focus {
        border-color: #1890ff
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2)
    }
}
</style>
