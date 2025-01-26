<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ 
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number,
    fromDot: 'l' | 't' | 'b' | 'r',
    toDot: 'l' | 't' | 'b' | 'r'
}>()


const d = computed(function() {
    const x = props.fromX - 15
    const y = props.fromY - 75
    const toX = props.toX - 15
    const toY = props.toY - 75
    
    // 计算基本参数
    const deltaX = toX - x
    const deltaY = toY - y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const controlPointOffset = Math.min(100, Math.max(50, distance * 0.3))
    
    // 计算控制点
    let c1x, c1y, c2x, c2y
    
    // 根据起点连接点方向设置第一个控制点
    switch(props.fromDot) {
        case 'l':
            c1x = x - controlPointOffset
            c1y = y
            break
        case 'r':
            c1x = x + controlPointOffset
            c1y = y
            break
        case 't':
            c1x = x
            c1y = y - controlPointOffset
            break
        case 'b':
            c1x = x
            c1y = y + controlPointOffset
            break
    }
    
    // 根据终点连接点方向设置第二个控制点
    switch(props.toDot) {
        case 'l':
            c2x = toX - controlPointOffset
            c2y = toY
            break
        case 'r':
            c2x = toX + controlPointOffset
            c2y = toY
            break
        case 't':
            c2x = toX
            c2y = toY - controlPointOffset
            break
        case 'b':
            c2x = toX
            c2y = toY + controlPointOffset
            break
    }
    
    return `M${x} ${y} C${c1x} ${c1y}, ${c2x} ${c2y}, ${toX} ${toY}`
})

function setActiveLine() {
    
}

</script>

<template>
    <path
        data-role="line"
        v-if="props.toX !== -1 && props.toY !== -1"
        :d="d"
        stroke="lightblue"
        stroke-width="2"
        fill="none"
        marker-end='url(#head)'
        @click="setActiveLine"
    ></path>
</template>

<style scoped lang="stylus">
path{
    transition: stroke-width 50ms linear
}
path:hover{
    stroke: green
    cursor pointer
    stroke-width: 4px
}
</style>
