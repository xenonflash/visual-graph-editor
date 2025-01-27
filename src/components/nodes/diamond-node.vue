<template>
    <base-node :node="node" :isActive="isActive">
        <template #shape>
            <svg class="diamond-shape" :width="node.width" :height="node.height">
                <polygon 
                    :points="`${node.width/2},0 ${node.width},${node.height/2} ${node.width/2},${node.height} 0,${node.height/2}`"
                    class="diamond-polygon"
                />
            </svg>
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
        background: transparent
        border: none
        
        // 调整连接点位置
        :deep(.dot) {
            &.t {
                left: 50%
                top: 0
                transform: translate(-50%, -50%)
            }
            &.r {
                top: 50%
                right: 0
                transform: translate(50%, -50%)
            }
            &.b {
                left: 50%
                bottom: 0
                transform: translate(-50%, 50%)
            }
            &.l {
                top: 50%
                left: 0
                transform: translate(-50%, -50%)
            }
        }
    }
}

.diamond-shape {
    position: absolute
    top: 0
    left: 0
    pointer-events: none
}

.diamond-polygon {
    fill: none
    stroke: currentColor
    stroke-width: 1.5
}

.diamond-content {
    position: relative
    z-index: 1
    padding: 8px
    text-align: center
    pointer-events: none
}
</style>
