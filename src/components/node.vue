<script setup lang="ts">
import { computed, onMounted, ref, toRefs} from 'vue';
import { dragable } from '../utils/move'
import {  useStore } from '../store'
import { storeToRefs } from 'pinia';
const store = useStore()
const { activeNodeId} = storeToRefs(store)


const nodeEl = ref()

const props = defineProps<{ msg: string, id: string }>()
const { id } = toRefs(props)

const isActive = computed(() => activeNodeId.value === id.value)

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
        :class="{'is-active': isActive}"
        @mousedown="setActive(id)"
    >
        {{ msg }}
        <div class="handles" v-if="isActive">
            <div class="dot left"></div>
            <div class="dot right"></div>
            <div class="dot top"></div>
            <div class="dot bottom"></div>
        </div>
    </div>
</template>

<style scoped lang="stylus">
    .node-container{
        width 100px
        min-height 100px
        border-radius: 10px
        background #fff
        position: absolute
        display flex
        align-items: center
        justify-content: center
        border: 2px solid #ccc
        padding: 10px
        font-size 12px
        box-sizing border-box
    }
    .is-active{
        border-color blue
    }
    .handles{
        position: absolute
        width: 100%
        height: 100%
        border: 2px solid blue
        border-radius 10px
        .dot{
            position: absolute
            width: 10px
            height: 10px
            cursor pointer
            background lightgreen
            border-radius: 50%
        }
        .top{
            left: calc(50% - 6px)
            top: -6px
        }
        .left{
            left: -6px
            top: calc(50% - 5px)
        }
        .right{
            left: calc(100% - 4px)
            top: calc(50% - 6px)
        }
        .bottom{
            left: calc(50% - 6px)
            top: calc(100% - 4px)
        }
    }
</style>
