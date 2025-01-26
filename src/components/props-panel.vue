<template>
    <div class="container">
        <div v-if="activeNode" class="form">
            <div class="form-item">
                <label>节点ID：</label>
                <div class="readonly-text">{{ activeNode.id }}</div>
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
        <div v-else class="empty-tip">
            请选择一个节点
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
.container {
    height 100%
    width: 200px
    padding: 16px
    background: #f5f5f5
    box-sizing: border-box
}

.form {
    .form-item {
        margin-bottom: 16px
        
        label {
            display: block
            margin-bottom: 8px
            color: #666
            font-size: 12px
        }
        
        .readonly-text {
            padding: 8px
            background: #e8e8e8
            border-radius: 4px
            color: #999
            font-size: 12px
            user-select: text
        }
        
        .content-input {
            width: 100%
            padding: 8px
            border: 1px solid #ddd
            border-radius: 4px
            font-size: 12px
            box-sizing: border-box
            outline: none
            
            &:focus {
                border-color: #3498db
            }
        }
    }
}

.empty-tip {
    color: #999
    font-size: 12px
    text-align: center
    margin-top: 20px
}
</style>