<template>
    <div class="left-panel">
        <!-- 组件选择区域 -->
        <div class="components-panel">
            <div class="panel-header">
                <span class="panel-title">组件</span>
                <div class="panel-tools">
                    <button class="tool-btn">
                        <i class="icon-search"></i>
                    </button>
                </div>
            </div>
            <div class="components-grid">
                <div class="component-item" @click="store.addNode('default')">
                    <div class="preview-wrapper">
                        <div class="preview square"></div>
                    </div>
                    <span>方形节点</span>
                </div>
                <div class="component-item" @click="store.addNode('diamond')">
                    <div class="preview-wrapper">
                        <div class="preview diamond"></div>
                    </div>
                    <span>菱形节点</span>
                </div>
            </div>
        </div>
        
        <!-- 组件树区域 -->
        <div class="components-tree">
            <div class="panel-header">
                <span class="panel-title">图层</span>
                <div class="panel-tools">
                    <button class="tool-btn">
                        <i class="icon-plus"></i>
                    </button>
                    <button class="tool-btn">
                        <i class="icon-more"></i>
                    </button>
                </div>
            </div>
            <div class="tree-content">
                <div v-for="node in nodes" 
                    :key="node.id" 
                    class="tree-node"
                    :class="{ 'is-active': node.id === activeNodeId }"
                    @click="handleNodeClick(node.id)"
                >
                    <div class="node-icon" :class="node.type"></div>
                    <span class="node-content">{{ node.content }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from '../store'
import { storeToRefs } from 'pinia'

const store = useStore()
const { nodes, activeNodeId } = storeToRefs(store)

function handleNodeClick(id: string) {
    store.setActiveNodeId(id)
}
</script>

<style lang="stylus" scoped>
.left-panel {
    width: 240px
    height: 100%
    border-right: 1px solid rgba(0,0,0,0.08)
    background: #fff
    display: flex
    flex-direction: column
}

.panel-header {
    height: 40px
    padding: 0 8px 0 12px
    display: flex
    align-items: center
    justify-content: space-between
    border-bottom: 1px solid rgba(0,0,0,0.08)
}

.panel-title {
    font-size: 11px
    font-weight: 600
    color: #333
    text-transform: uppercase
    letter-spacing: 0.5px
}

.panel-tools {
    display: flex
    gap: 4px
}

.tool-btn {
    width: 24px
    height: 24px
    border: none
    background: transparent
    border-radius: 2px
    cursor: pointer
    display: flex
    align-items: center
    justify-content: center
    color: #333
    opacity: 0.8
    
    &:hover {
        background: rgba(0,0,0,0.06)
    }
}

.components-panel {
    flex: none
    border-bottom: 1px solid rgba(0,0,0,0.08)
}

.components-grid {
    padding: 8px
    display: grid
    grid-template-columns: repeat(2, 1fr)
    gap: 8px
}

.component-item {
    display: flex
    flex-direction: column
    align-items: center
    gap: 4px
    cursor: pointer
    border-radius: 2px
    padding: 8px 4px
    
    &:hover {
        background: rgba(0,0,0,0.04)
        
        .preview {
            border-color: #333
        }
    }
    
    span {
        font-size: 11px
        color: #333
    }
}

.preview-wrapper {
    width: 48px
    height: 48px
    display: flex
    align-items: center
    justify-content: center
}

.preview {
    width: 32px
    height: 32px
    border: 1.5px solid #666
    transition: all 0.2s
    
    &.square {
        border-radius: 2px
    }
    
    &.diamond {
        transform: rotate(45deg)
    }
}

.components-tree {
    flex: 1
    overflow: hidden
    display: flex
    flex-direction: column
    background: #fafafa
}

.tree-content {
    flex: 1
    overflow-y: auto
    padding: 4px
}

.tree-node {
    display: flex
    align-items: center
    gap: 6px
    padding: 4px 8px
    cursor: pointer
    border-radius: 2px
    margin: 1px 0
    
    &:hover {
        background: rgba(0,0,0,0.04)
    }
    
    &.is-active {
        background: #daebf7
    }
}

.node-icon {
    width: 14px
    height: 14px
    border: 1.5px solid currentColor
    flex-shrink: 0
    opacity: 0.8
    
    &.default {
        border-radius: 2px
    }
    
    &.diamond {
        transform: rotate(45deg)
    }
}

.node-content {
    font-size: 11px
    flex: 1
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    color: #333
}

// Icons
.icon-search, .icon-plus, .icon-more {
    width: 16px
    height: 16px
    position: relative
    
    &::before, &::after {
        content: ''
        position: absolute
        background: currentColor
    }
}

.icon-search::before {
    width: 9px
    height: 9px
    border: 1.5px solid currentColor
    border-radius: 50%
    left: 2px
    top: 2px
}

.icon-search::after {
    width: 1.5px
    height: 6px
    transform: rotate(-45deg)
    right: 4px
    bottom: 3px
    background: currentColor
}

.icon-plus {
    &::before {
        width: 10px
        height: 1.5px
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
    }
    
    &::after {
        width: 1.5px
        height: 10px
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
    }
}

.icon-more {
    &::before {
        width: 2px
        height: 2px
        top: 50%
        left: 3px
        transform: translateY(-50%)
        box-shadow: 0 0 0 1.5px currentColor, 
                   7px 0 0 1.5px currentColor,
                   14px 0 0 1.5px currentColor
    }
}
</style>