<template>
    <base-node :node="node" :isActive="isActive" class="circle-node">
        <template #shape>
            <div class="circle-wrapper">
                <svg class="circle-shape" :width="node.width" :height="node.height">
                    <circle 
                        :cx="node.width/2"
                        :cy="node.height/2"
                        :r="Math.min(node.width, node.height)/2 - 2"
                        class="circle-path"
                    />
                </svg>
            </div>
        </template>
        <template #default>
            <div class="circle-content">
                {{ node.content }}
            </div>
        </template>
    </base-node>
</template>

<script lang="ts" setup>
import BaseNode from '../base-node/base-node.vue'
import { INode } from '../../typings'

defineProps<{
    node: INode
    isActive: boolean
}>()
</script>

<style lang="stylus" scoped>
.circle-node {
    :deep(.node-container) {
        background: transparent !important
        border: none !important
        
        // 调整连接点位置
        .dot {
            position: absolute
            border: 1.5px solid #8c8c8c
            background: #fff
            width: 8px
            height: 8px
            margin: -4px
            
            &:hover {
                border-color: #1890ff
                background: #e6f7ff
            }
            
            &.t {
                left: 50%
                top: 0
            }
            &.r {
                left: 100%
                top: 50%
            }
            &.b {
                left: 50%
                top: 100%
            }
            &.l {
                left: 0
                top: 50%
            }
        }
    }
}

.circle-wrapper {
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
}

.circle-shape {
    position: absolute
    top: 0
    left: 0
    pointer-events: none
    z-index: 1
}

.circle-path {
    fill: transparent
    stroke: #8c8c8c
    stroke-width: 1.5
    transition: border-color 0.2s
}

.circle-content {
    position: relative
    z-index: 2
    padding: 8px
    text-align: center
    pointer-events: none
    background: transparent
}

:deep(.is-active) {
    .circle-path {
        stroke: #1890ff !important
    }
}

:deep(.is-hover) {
    .circle-path {
        stroke: #1890ff !important
    }
}
</style>
