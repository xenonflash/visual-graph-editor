<script setup lang="ts">
import { computed, ref } from 'vue'



const props = defineProps<{ fromX: number, fromY: number, toX: number, toY: number }>()


const d = computed(function() {
    const x = props.fromX - 15
    const y = props.fromY - 75
    const toX = props.toX - 15
    const toY = props.toY - 75
    return `M${x} ${y}, L${toX} ${toY}`
})

function setActiveLine() {
    
}

</script>

<template>
    <path
        v-if="props.toX !== -1 && props.toY !== -1"
        :d="d"
        stroke="lightblue"
        stroke-width="2"
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
    fill: green
    cursor pointer
    stroke-width: 4px
}
</style>
