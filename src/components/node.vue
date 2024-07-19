<script setup lang="ts">
import { onMounted, ref} from 'vue';
import { dragable } from '../utils/move'
const nodeEl = ref()

defineProps<{ msg: string }>()

onMounted(() => {
    dragable(nodeEl.value!)
})

</script>

<template>
    <div class="node-container" ref="nodeEl">
        {{ msg }}
    </div>
</template>

<style scoped lang="stylus">
    .node-container{
        width 100px
        min-height 100px
        border: 2px solid #ccc
        border-radius: 10px
        background #fff
        position: absolute
        display flex
        align-items: center
        justify-content: center
    }
</style>
