<template>
    <div class="left-panel">
        <!-- 组件选择区域 -->
        <div class="panel-section">
            <div class="section-title">基础节点</div>
            <div class="components-list">
                <div class="component-item" @click="store.addNode('rect')">
                    <div class="preview-wrapper">
                        <div class="preview rect">
                            <div class="preview-dots">
                                <div class="dot t"></div>
                                <div class="dot r"></div>
                                <div class="dot b"></div>
                                <div class="dot l"></div>
                            </div>
                        </div>
                    </div>
                    <span>矩形节点</span>
                </div>
                <div class="component-item" @click="store.addNode('diamond')">
                    <div class="preview-wrapper">
                        <div class="preview diamond">
                            <div class="preview-dots">
                                <div class="dot t"></div>
                                <div class="dot r"></div>
                                <div class="dot b"></div>
                                <div class="dot l"></div>
                            </div>
                        </div>
                    </div>
                    <span>菱形节点</span>
                </div>
                <div class="component-item" @click="store.addNode('circle')">
                    <div class="preview-wrapper">
                        <div class="preview circle">
                            <div class="preview-dots">
                                <div class="dot t"></div>
                                <div class="dot r"></div>
                                <div class="dot b"></div>
                                <div class="dot l"></div>
                            </div>
                        </div>
                    </div>
                    <span>圆形节点</span>
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
    background: #fff
    border-right: 1px solid rgba(0, 0, 0, 0.08)
    display: flex
    flex-direction: column
    height: 100%
    user-select: none
}

.panel-section {
    padding: 12px 8px
    border-bottom: 1px solid rgba(0, 0, 0, 0.08)
}

.section-title {
    font-size: 11px
    color: #333
    margin-bottom: 12px
    padding: 0 4px
    font-weight: 500
    text-transform: uppercase
    letter-spacing: 0.5px
    opacity: 0.8
}

.components-list {
    display: grid
    grid-template-columns: repeat(2, 1fr)
    gap: 8px
    padding: 0 4px
}

.component-item {
    cursor: pointer
    text-align: center
    border-radius: 2px
    
    &:hover {
        .preview {
            border-color: #1890ff
            background: rgba(24, 144, 255, 0.02)
        }
        .preview-dots .dot {
            opacity: 0.6
        }
        span {
            color: #1890ff
        }
    }
}

.preview-wrapper {
    padding: 6px
    margin-bottom: 4px
    border-radius: 4px
    
    &:hover {
        background: rgba(0, 0, 0, 0.02)
    }
}

.preview {
    height: 50px
    border: 1px solid rgba(0, 0, 0, 0.08)
    background: #fff
    transition: all 0.2s
    position: relative
    
    &.rect {
        border-radius: 2px
    }
    
    &.diamond {
        transform: rotate(45deg) scale(0.7)
        
        .preview-dots {
            transform: rotate(-45deg)
        }
    }
    
    &.circle {
        border-radius: 50%
        height: 50px
    }
}

.preview-dots {
    position: absolute
    inset: 0
    pointer-events: none
    
    .dot {
        position: absolute
        width: 4px
        height: 4px
        border-radius: 50%
        background: #1890ff
        opacity: 0
        transition: opacity 0.2s
        
        &.t {
            top: -2px
            left: 50%
            transform: translateX(-50%)
        }
        
        &.r {
            right: -2px
            top: 50%
            transform: translateY(-50%)
        }
        
        &.b {
            bottom: -2px
            left: 50%
            transform: translateX(-50%)
        }
        
        &.l {
            left: -2px
            top: 50%
            transform: translateY(-50%)
        }
    }
}

span {
    font-size: 11px
    color: #333
    transition: color 0.2s
    display: block
    margin-top: 4px
}

.components-tree {
    flex: 1
    overflow: hidden
    display: flex
    flex-direction: column
    background: #fff
    border-top: 1px solid rgba(0, 0, 0, 0.08)
}

.panel-header {
    display: flex
    align-items: center
    justify-content: space-between
    padding: 8px 8px
    border-bottom: 1px solid rgba(0, 0, 0, 0.08)
    background: #fafafa
}

.panel-title {
    font-size: 11px
    color: #333
    font-weight: 500
    text-transform: uppercase
    letter-spacing: 0.5px
    opacity: 0.8
}

.panel-tools {
    display: flex
    gap: 2px
}

.tool-btn {
    width: 24px
    height: 24px
    border: none
    background: transparent
    color: #666
    cursor: pointer
    border-radius: 2px
    display: flex
    align-items: center
    justify-content: center
    transition: all 0.2s
    
    &:hover {
        background: rgba(0, 0, 0, 0.04)
        color: #333
    }
    
    &:active {
        background: rgba(0, 0, 0, 0.08)
    }
}

.tree-content {
    flex: 1
    overflow-y: auto
    padding: 4px 8px
    
    &::-webkit-scrollbar {
        width: 8px
    }
    
    &::-webkit-scrollbar-track {
        background: transparent
    }
    
    &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1)
        border-radius: 4px
        border: 2px solid #fff
        
        &:hover {
            background: rgba(0, 0, 0, 0.2)
        }
    }
}

.tree-node {
    display: flex
    align-items: center
    gap: 6px
    padding: 4px 8px
    cursor: pointer
    border-radius: 2px
    margin: 1px 0
    height: 28px
    transition: all 0.15s ease-out
    
    &:hover {
        background: rgba(0, 0, 0, 0.02)
    }
    
    &.is-active {
        background: rgba(24, 144, 255, 0.08)
        
        .node-content {
            color: #1890ff
        }
        
        .node-icon {
            opacity: 0.8
            color: #1890ff
        }
    }
}

.node-icon {
    width: 12px
    height: 12px
    border: 1px solid currentColor
    flex-shrink: 0
    opacity: 0.4
    transition: all 0.2s
    
    &.rect {
        border-radius: 2px
    }
    
    &.diamond {
        transform: rotate(45deg) scale(0.8)
    }
    
    &.circle {
        border-radius: 50%
    }
}

.node-content {
    font-size: 11px
    flex: 1
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
    color: #333
    line-height: 1.4
    transition: color 0.2s
}

// Icons
.icon-search, .icon-plus, .icon-more {
    width: 14px
    height: 14px
    position: relative
    opacity: 0.8
    
    &::before, &::after {
        content: ''
        position: absolute
        background: currentColor
    }
}

.icon-search::before {
    width: 8px
    height: 8px
    border: 1.2px solid currentColor
    border-radius: 50%
    left: 2px
    top: 2px
}

.icon-search::after {
    width: 1.2px
    height: 5px
    transform: rotate(-45deg)
    right: 4px
    bottom: 3px
}

.icon-plus {
    &::before {
        width: 9px
        height: 1.2px
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
    }
    
    &::after {
        width: 1.2px
        height: 9px
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
    }
}

.icon-more {
    &::before {
        width: 1.5px
        height: 1.5px
        top: 50%
        left: 3px
        transform: translateY(-50%)
        box-shadow: 0 0 0 1.2px currentColor, 
                   6px 0 0 1.2px currentColor,
                   12px 0 0 1.2px currentColor
    }
}
</style>