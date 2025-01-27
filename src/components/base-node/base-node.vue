<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs, watch, nextTick } from 'vue';
import { dragable } from '../../utils/move'
import { useStore } from '../../store'
import { storeToRefs } from 'pinia';
import { nanoid } from 'nanoid';
import { IDot, ILine, INode } from '../../typings';

const store = useStore()
const { activeNodeId, hoverNodeId, hoverNode, hoverDot, transform } = storeToRefs(store)

const nodeEl = ref()

const props = defineProps<{ 
    node: INode
    isActive: boolean 
}>()
const { node } = toRefs(props)

const isHover = computed(() => {
    return hoverNodeId?.value === node.value.id
})

const isEditing = ref(false)
const editContent = ref('')

function handleDoubleClick() {
    isEditing.value = true
    editContent.value = node.value.content
    nextTick(() => {
        const input = nodeEl.value.querySelector('input')
        if (input) {
            input.focus()
        }
    })
}

function saveContent() {
    if (isEditing.value) {
        store.updateNodeContent(node.value.id, editContent.value)
        isEditing.value = false
    }
}

function handleGlobalClick(e: MouseEvent) {
    if (!nodeEl.value?.contains(e.target)) {
        saveContent()
    }
}

function handleNodeMouseDown(e: MouseEvent) {
    if (e.button !== 0) return // 只响应左键
    e.stopPropagation() // 阻止事件冒泡
    
    // 设置当前节点为活动节点
    store.setActiveNodeId(props.node.id)
    
    // 获取画布元素和变换信息
    const boardEl = document.querySelector('.board')
    const boardRect = boardEl?.getBoundingClientRect()
    if (!boardEl || !boardRect) return
    
    const { scale } = transform.value
    
    // 记录起始位置
    const startMousePos = { x: e.clientX, y: e.clientY }
    const startNodePos = { x: props.node.x, y: props.node.y }
    
    function handleMouseMove(e: MouseEvent) {
        // 计算鼠标移动的距离（考虑缩放）
        const dx = (e.clientX - startMousePos.x) / scale
        const dy = (e.clientY - startMousePos.y) / scale
        
        // 更新节点位置
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

function handleDotMouseDown(e: MouseEvent, dir: string) {
    e.stopPropagation() // 阻止事件冒泡到节点
    
    const dotEl = e!.currentTarget as HTMLElement
    const nodeEl = dotEl.closest('[data-role="base-node"]') as HTMLElement
    if (!dotEl || !nodeEl) return
    
    // 获取画布元素和变换信息
    const boardEl = document.querySelector('.board')
    const boardRect = boardEl?.getBoundingClientRect()
    if (!boardEl || !boardRect) return
    
    const { scale, x: transformX, y: transformY } = transform.value
    
    // 获取节点和连接点的位置信息
    const nodeRect = nodeEl.getBoundingClientRect()
    const dotRect = dotEl.getBoundingClientRect()
    
    // 计算连接点相对于节点的偏移
    const dotOffsetX = (dotRect.left - nodeRect.left)
    const dotOffsetY = (dotRect.top - nodeRect.top)
    
    // 计算节点在画布坐标系中的位置
    const nodeX = (nodeRect.left - boardRect.left - transformX) / scale
    const nodeY = (nodeRect.top - boardRect.top - transformY) / scale
    
    // 计算连接点在画布坐标系中的实际位置
    const dotX = nodeX + dotOffsetX / scale
    const dotY = nodeY + dotOffsetY / scale
    
    // 创建临时连线
    const tempLine: ILine = {
        id: nanoid(10),
        fromNode: props.node.id,
        toNode: '',
        fromDot: dir,
        toDot: 'l',
        fromX: dotX,
        fromY: dotY,
        toX: dotX,
        toY: dotY
    }
    store.addLine(tempLine)
    
    function handleMouseMove(e: MouseEvent) {
        // 计算鼠标在画布坐标系中的位置
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
            // 获取目标节点和连接点元素
            const toNodeEl = document.querySelector(`[data-node-id="${toNode.id}"]`)
            const toDotEl = toNodeEl?.querySelector(`.dot.${toDot.dir}`)
            
            if (toNodeEl && toDotEl) {
                // 获取目标节点和连接点的位置信息
                const toNodeRect = toNodeEl.getBoundingClientRect()
                const toDotRect = toDotEl.getBoundingClientRect()
                
                // 计算目标连接点相对于目标节点的偏移
                const toDotOffsetX = (toDotRect.left - toNodeRect.left)
                const toDotOffsetY = (toDotRect.top - toNodeRect.top)
                
                // 计算目标节点在画布坐标系中的位置
                const toNodeX = (toNodeRect.left - boardRect.left - transformX) / scale
                const toNodeY = (toNodeRect.top - boardRect.top - transformY) / scale
                
                // 计算目标连接点在画布坐标系中的实际位置
                const toX = toNodeX + toDotOffsetX / scale
                const toY = toNodeY + toDotOffsetY / scale
                
                store.updateLine(tempLine.id, {
                    toDot: toDot.dir,
                    toX,
                    toY,
                    toNode: toNode.id
                })
            }
        } else {
            store.removeLine(tempLine.id)
        }
        
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
}

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
    </div>
</template>

<style lang="stylus" scoped>
.node-container {
    position: absolute
    background: #fff
    border-radius: 4px
    cursor: move
    user-select: none
    display: flex
    align-items: center
    justify-content: center
    color: var(--text-primary)
    left: 0
    top: 0
    
    &.has-border {
        border: 1.5px solid var(--border-color)
    }
    
    &.is-active {
        border-color: #1890ff
        z-index: 2
    }
    
    &.is-hover {
        border-color: #1890ff
    }
}

.dot {
    position: absolute
    width: 10px
    height: 10px
    background: #fff
    border: 1.5px solid var(--border-color)
    border-radius: 50%
    z-index: 2
    cursor: crosshair
    
    &:hover {
        border-color: #1890ff
        background: #e6f7ff
    }
}

.edit-input {
    width: 90%
    height: 24px
    border: none
    outline: none
    text-align: center
    background: transparent
    color: inherit
}
</style>
