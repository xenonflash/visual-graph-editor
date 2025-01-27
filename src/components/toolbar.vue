<template>
    <div class="toolbar">
        <div class="tool-group">
            <button class="toolbar-btn" @click="store.addNode()">
                <div class="icon square"></div>
                <span>方形</span>
            </button>
            <button class="toolbar-btn" @click="store.addNode('diamond')">
                <div class="icon diamond"></div>
                <span>菱形</span>
            </button>
            <button class="toolbar-btn" :disabled="!activeNodeId" @click="handleRemoveNode">
                <div class="icon delete"></div>
                <span>删除</span>
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
        <div class="divider"></div>
        <div class="zoom-controls">
            <button class="toolbar-btn" @click="handleZoom('out')" :disabled="scale <= 0.1">
                <div class="icon zoom-out"></div>
            </button>
            <div class="zoom-value" @click="handleResetZoom">{{ Math.round(scale * 100) }}%</div>
            <button class="toolbar-btn" @click="handleZoom('in')" :disabled="scale >= 3">
                <div class="icon zoom-in"></div>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '../store'
import { storeToRefs } from 'pinia'
import { getCurrentTransform, setTransform } from '../utils/move'
import { computed } from 'vue'

const store = useStore()
const { activeNodeId, history } = storeToRefs(store)
const scale = computed(() => getCurrentTransform().scale)

function handleRemoveNode() {
    if (activeNodeId.value) {
        store.removeNode(activeNodeId.value)
    }
}

function handleZoom(type: 'in' | 'out') {
    const currentTransform = getCurrentTransform()
    const boardEl = document.querySelector('.board') as HTMLElement
    
    if (boardEl) {
        const delta = type === 'in' ? 0.1 : -0.1
        const newScale = Math.min(3, Math.max(0.1, currentTransform.scale + delta))
        
        setTransform({
            ...currentTransform,
            scale: newScale
        }, boardEl)
    }
}

function handleResetZoom() {
    const boardEl = document.querySelector('.board') as HTMLElement
    if (boardEl) {
        setTransform({
            x: 0,
            y: 0,
            scale: 1
        }, boardEl)
    }
}
</script>

<style lang="stylus" scoped>
.toolbar {
    position: fixed
    top: 0
    left: 0
    right: 0
    height: 48px
    display: flex
    align-items: center
    padding: 0 16px
    background: #fff
    border-bottom: 1px solid rgba(0, 0, 0, 0.08)
    z-index: 100
    backdrop-filter: blur(8px)
    background: rgba(255, 255, 255, 0.95)
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02),
                0 4px 12px rgba(0, 0, 0, 0.04)
    transition: box-shadow 0.2s ease
    
    &::after {
        content: ''
        position: absolute
        bottom: 0
        left: 0
        right: 0
        height: 1px
        background: linear-gradient(to right,
            rgba(0, 0, 0, 0.05) 0%,
            rgba(0, 0, 0, 0.08) 50%,
            rgba(0, 0, 0, 0.05) 100%)
    }
}

.tool-group {
    display: flex
    gap: 4px
    padding: 2px
    background: rgba(0, 0, 0, 0.02)
    border-radius: 6px
}

.divider {
    width: 1px
    height: 24px
    background: linear-gradient(to bottom,
        rgba(0, 0, 0, 0.02),
        rgba(0, 0, 0, 0.08),
        rgba(0, 0, 0, 0.02))
    margin: 0 12px
}

.toolbar-btn {
    display: flex
    flex-direction: column
    align-items: center
    gap: 2px
    padding: 4px
    min-width: 40px
    height: 40px
    border: none
    background: transparent
    cursor: pointer
    border-radius: 4px
    color: #333
    position: relative
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)
    
    &:hover:not(:disabled) {
        background: rgba(0, 0, 0, 0.04)
        color: #1890ff
        
        .icon {
            transform: scale(1.1)
            
            &.diamond {
                transform: rotate(45deg) scale(1.1)
            }
            
            &.redo {
                transform: scaleX(-1) scale(1.1)
            }
        }
    }
    
    &:active:not(:disabled) {
        background: rgba(24, 144, 255, 0.1)
        color: #1890ff
        transform: scale(0.95)
    }
    
    &:disabled {
        opacity: 0.4
        cursor: not-allowed
    }
    
    span {
        font-size: 11px
        color: inherit
        font-weight: 500
        transform: scale(0.9)
        transition: transform 0.2s
    }
}

.icon {
    width: 18px
    height: 18px
    position: relative
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)
    
    &.square {
        border: 1.5px solid currentColor
        border-radius: 2px
    }
    
    &.diamond {
        border: 1.5px solid currentColor
        transform: rotate(45deg)
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)
    }
    
    &.delete {
        &::before, &::after {
            content: ''
            position: absolute
            width: 18px
            height: 1.5px
            background: currentColor
            top: 50%
            left: 50%
            transition: all 0.2s
        }
        &::before {
            transform: translate(-50%, -50%) rotate(45deg)
        }
        &::after {
            transform: translate(-50%, -50%) rotate(-45deg)
        }
    }
    
    &.undo, &.redo {
        &::before {
            content: ''
            position: absolute
            width: 13px
            height: 13px
            border: 1.5px solid currentColor
            border-radius: 50%
            border-right-color: transparent
            top: 50%
            left: 50%
            transform: translate(-50%, -50%) rotate(45deg)
            transition: all 0.2s
        }
        
        &::after {
            content: ''
            position: absolute
            width: 5px
            height: 5px
            border: 1.5px solid currentColor
            border-top: none
            border-left: none
            top: 2px
            left: 50%
            transform: translateX(-50%) rotate(45deg)
            transition: all 0.2s
        }
    }
    
    &.redo {
        transform: scaleX(-1)
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)
    }
    
    &.zoom-in, &.zoom-out {
        &::before {
            content: ''
            position: absolute
            width: 11px
            height: 11px
            border: 1.5px solid currentColor
            border-radius: 50%
            top: 2px
            left: 2px
            transition: all 0.2s
        }
        
        &::after {
            content: ''
            position: absolute
            width: 6px
            height: 1.5px
            background: currentColor
            bottom: 3px
            right: 2px
            transform: rotate(45deg)
            transition: all 0.2s
        }
    }
    
    &.zoom-in {
        &::before {
            &::after {
                content: ''
                position: absolute
                width: 5px
                height: 1.5px
                background: currentColor
                top: 50%
                left: 50%
                transform: translate(-50%, -50%)
            }
            
            &::before {
                content: ''
                position: absolute
                width: 1.5px
                height: 5px
                background: currentColor
                top: 50%
                left: 50%
                transform: translate(-50%, -50%)
            }
        }
    }
}

.zoom-controls {
    display: flex
    align-items: center
    gap: 4px
    padding: 2px
    background: rgba(0, 0, 0, 0.02)
    border-radius: 6px
}

.zoom-value {
    font-size: 11px
    font-weight: 500
    color: #333
    padding: 0 8px
    min-width: 48px
    text-align: center
    cursor: pointer
    height: 24px
    line-height: 24px
    border-radius: 3px
    transition: all 0.2s
    
    &:hover {
        background: rgba(0, 0, 0, 0.04)
        color: #1890ff
    }
}
</style>
