<script setup lang="ts">
import { computed, ref } from 'vue'

export interface ILine{
    id: string,
    fromNode: string,
    toNode: string,
    fromDot: 'l' | 't' | 'b' | 'r',
    toDot: string,
    fromX: number, // 球的半径
    fromY: number,
    toX: number,
    toY: number,
    temp: boolean
}



const props = defineProps<{ fromX: number, fromY: number, toX: number, toY: number }>()


const d = computed(function() {
    const x = props.fromX - 15
    const y = props.fromY - 75
    const toX = props.toX - 15
    const toY = props.toY - 75
    return `M${x} ${y}, L${toX} ${toY}`
})

</script>

<template>
    <path v-if="props.toX !== -1 && props.toY !== -1" :d="d" stroke="lightblue" stroke-width="2"></path>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
