<template>
    <base-node :node="node" :isActive="isActive" class="diamond-node">
        <template #shape>
            <div class="diamond-wrapper">
                <svg class="diamond-shape" :width="node.width" :height="node.height">
                    <polygon 
                        :points="`${node.width/2},0 ${node.width},${node.height/2} ${node.width/2},${node.height} 0,${node.height/2}`"
                        class="diamond-polygon"
                    />
                </svg>
            </div>
        </template>
        <template #default>
            <div class="diamond-content">
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
.diamond-node {
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

.diamond-wrapper {
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
}

.diamond-shape {
    position: absolute
    top: 0
    left: 0
    pointer-events: none
    z-index: 1
}

.diamond-polygon {
    fill: transparent
    stroke: #8c8c8c
    stroke-width: 1.5
    transition: borer-color 0.2s
}

.diamond-content {
    position: relative
    z-index: 2
    padding: 8px
    text-align: center
    pointer-events: none
    background: transparent
}

:deep(.is-active) {
    .diamond-polygon {
        stroke: #1890ff !important
    }
}

:deep(.is-hover) {
    .diamond-polygon {
        stroke: #1890ff !important
    }
}
</style>
