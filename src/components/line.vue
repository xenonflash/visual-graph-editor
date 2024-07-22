<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ fromX: number, fromY: number, toX: number, toY: number }>()


const d = computed(function() {
    const x = props.fromX - 15
    const y = props.fromY - 75
    return `M${x} ${y}, L300 300`
})

</script>

<template>
    <path :d="d" stroke="lightblue" stroke-width="2"></path>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
