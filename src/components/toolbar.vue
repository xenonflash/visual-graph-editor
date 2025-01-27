<template>
    <div class="toolbar">
        <div class="tool-group">
            <button class="toolbar-btn" @click="store.addNode()">
                <div class="icon square"></div>
                <span>方形节点</span>
            </button>
            <button class="toolbar-btn" @click="store.addNode('diamond')">
                <div class="icon diamond"></div>
                <span>菱形节点</span>
            </button>
            <button class="toolbar-btn" :disabled="!activeNodeId" @click="handleRemoveNode">
                <div class="icon delete"></div>
                <span>删除节点</span>
            </button>
        </div>
        <div class="divider"></div>
        <div class="tool-group">
            <button class="toolbar-btn" :disabled="history.past.length < 1" @click="store.undo()">
                <div class="icon undo"></div>
                <span>撤销</span>
            </button>
            <button class="toolbar-btn" :disabled="history.future.length < 1" @click="store.redo()">
                <div class="icon redo"></div>
                <span>重做</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from '../store'
import { storeToRefs } from 'pinia'

const store = useStore()
const { activeNodeId, history } = storeToRefs(store)

function handleRemoveNode() {
    if (activeNodeId.value) {
        store.removeNode(activeNodeId.value)
    }
}
</script>

<style lang="stylus" scoped>
.toolbar {
    position: fixed
    top: 0
    left: 0
    right: 0
    height: 60px
    display: flex
    align-items: center
    padding: 0 20px
    background: #fff
    border-bottom: 1px solid #ddd
    z-index: 100
}

.tool-group {
    display: flex
    gap: 8px
}

.divider {
    width: 1px
    height: 24px
    background: #ddd
    margin: 0 16px
}

.toolbar-btn {
    display: flex
    flex-direction: column
    align-items: center
    gap: 4px
    padding: 6px 8px
    border: none
    background: transparent
    cursor: pointer
    border-radius: 4px
    
    &:hover:not(:disabled) {
        background: #f5f5f5
    }
    
    &:disabled {
        opacity: 0.5
        cursor: not-allowed
    }
    
    span {
        font-size: 12px
        color: #666
    }
}

.icon {
    width: 20px
    height: 20px
    border: 2px solid #666
    
    &.square {
        border-radius: 2px
    }
    
    &.diamond {
        transform: rotate(45deg)
        border-radius: 2px
    }
    
    &.delete {
        border: none
        position: relative
        &::before, &::after {
            content: ''
            position: absolute
            width: 20px
            height: 2px
            background: #666
            top: 50%
            left: 50%
        }
        &::before {
            transform: translate(-50%, -50%) rotate(45deg)
        }
        &::after {
            transform: translate(-50%, -50%) rotate(-45deg)
        }
    }
    
    &.undo, &.redo {
        border: none
        border-top: 2px solid #666
        border-right: 2px solid #666
        width: 12px
        height: 12px
        transform: rotate(-135deg)
        margin-top: 4px
    }
    
    &.redo {
        transform: rotate(45deg)
    }
}
</style>
