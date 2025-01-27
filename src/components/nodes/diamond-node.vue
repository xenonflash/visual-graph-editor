<template>
    <base-node :data="data" class="diamond-node">
        <template #shape>
            <svg class="diamond-shape" :width="data.width" :height="data.height">
                <polygon 
                    :points="`${data.width/2},0 ${data.width},${data.height/2} ${data.width/2},${data.height} 0,${data.height/2}`"
                    class="diamond-polygon"
                />
            </svg>
        </template>
        <template #default>
            <div class="diamond-content">
                <slot>{{ data.content }}</slot>
            </div>
        </template>
    </base-node>
</template>

<script lang="ts" setup>
import BaseNode from '../base-node/base-node.vue'
import { INode } from '../../typings'

defineProps<{
    data: INode
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
    width: 100%
    height: 100%
    pointer-events: none
}

.diamond-polygon {
    fill: white
    stroke: #ddd
    stroke-width: 2px
    transition: stroke .2s
}

.diamond-content {
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    z-index: 1
    width: 70%
    text-align: center
    font-size: 12px
    color: #333
    pointer-events: none
}
</style>
