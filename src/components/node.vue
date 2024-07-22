<script setup lang="ts">
import { onMounted, ref} from 'vue';
import { dragable } from '../utils/move'
import {  useStore } from '../store'
import { storeToRefs } from 'pinia';
const store = useStore()
const { activeNodeId} = storeToRefs(store)

const nodeEl = ref()

defineProps<{ msg: string, id: string }>()

onMounted(() => {
    dragable(nodeEl.value!)
})

function setActive(id: string) {
    store.setActiveNodeId(id)
}

</script>

<template>
    <div
        class="node-container"
        ref="nodeEl"
        :class="{'is-active': activeNodeId === id}"
        @mousedown="setActive(id)"
    >
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
    .is-active{
        border-color blue
    }
</style>
