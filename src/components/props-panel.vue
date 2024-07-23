<template>
    <div class="container">
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { dragable, zoomable } from '../utils/move';
import Node from './base-node.vue'
import { useStore } from '../store'
import { storeToRefs } from 'pinia';
const { nodes } = storeToRefs(useStore())


onMounted(function () {
    // dragable(boardEl.value!)
    // zoomable(boardEl.value!)
})
</script>

<style lang="stylus" scoped>
.container{
    height 100%
    width: 200px
}
</style>