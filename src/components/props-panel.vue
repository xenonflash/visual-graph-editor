<template>
    <div class="props-panel">
        <div class="panel-header">
            <span class="panel-title">属性</span>
            <div class="panel-tools">
                <button class="tool-btn">
                    <i class="icon-more"></i>
                </button>
            </div>
        </div>
        
        <div v-if="activeNode" class="panel-content">
            <div class="section">
                <div class="section-header">基础信息</div>
                <div class="form-item">
                    <label>节点ID：</label>
                    <div class="value">{{ activeNode.id }}</div>
                </div>
                <div class="form-item">
                    <label>节点内容：</label>
                    <input 
                        type="text" 
                        v-model="nodeContent" 
                        class="content-input"
                        @input="handleContentChange"
                    />
                </div>
            </div>
        </div>
        
        <div v-else class="empty-state">
            <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4L4 14V34L24 44L44 34V14L24 4Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M4 14L24 24M24 24L44 14M24 24V44" stroke="currentColor" stroke-width="2"/>
                </svg>
            </div>
            <div class="empty-text">请选择一个节点</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useStore } from '../store'
import { storeToRefs } from 'pinia';

const store = useStore()
const { activeNode } = storeToRefs(store)
const nodeContent = ref('')

// 当选中节点变化时，更新内容
watch(() => activeNode.value, (node) => {
    if (node) {
        nodeContent.value = node.content
    }
}, { immediate: true })

// 内容变化时实时更新节点
function handleContentChange() {
    if (activeNode.value) {
        store.updateNodeContent(activeNode.value.id, nodeContent.value)
    }
}
</script>

<style lang="stylus" scoped>
.props-panel {
    width: 280px
    height: 100%
    border-left: 1px solid var(--border-color)
    background: var(--bg-primary)
    display: flex
    flex-direction: column
}

.panel-header {
    height: 40px
    padding: 0 8px 0 12px
    display: flex
    align-items: center
    justify-content: space-between
    border-bottom: 1px solid var(--border-color)
}

.panel-title {
    font-size: var(--font-size-small)
    font-weight: 600
    color: var(--text-primary)
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
    border-radius: var(--radius-small)
    cursor: pointer
    display: flex
    align-items: center
    justify-content: center
    color: var(--text-primary)
    opacity: 0.8
    
    &:hover {
        background: var(--hover-color)
    }
}

.panel-content {
    flex: 1
    overflow-y: auto
    padding: 16px
}

.section {
    margin-bottom: 24px
    
    &:last-child {
        margin-bottom: 0
    }
}

.section-header {
    font-size: var(--font-size-small)
    font-weight: 600
    color: var(--text-primary)
    margin-bottom: 12px
}

.form-item {
    margin-bottom: 12px
    
    &:last-child {
        margin-bottom: 0
    }
    
    label {
        display: block
        font-size: var(--font-size-small)
        color: var(--text-secondary)
        margin-bottom: 4px
    }
    
    .value {
        font-size: var(--font-size-normal)
        color: var(--text-primary)
    }
    
    .content-input {
        width: 100%
        height: 28px
        padding: 0 8px
        border: 1px solid var(--border-color)
        border-radius: var(--radius-small)
        font-size: var(--font-size-normal)
        color: var(--text-primary)
        background: var(--bg-primary)
        transition: all 0.2s
        
        &:hover {
            border-color: #1890ff
        }
        
        &:focus {
            outline: none
            border-color: #1890ff
            box-shadow: 0 0 0 2px rgba(24,144,255,0.2)
        }
    }
}

.empty-state {
    flex: 1
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    padding: 32px
    color: var(--text-secondary)
}

.empty-icon {
    margin-bottom: 16px
    opacity: 0.5
}

.empty-text {
    font-size: var(--font-size-normal)
    text-align: center
}

// Icons
.icon-more {
    width: 16px
    height: 16px
    position: relative
    
    &::before {
        content: ''
        position: absolute
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