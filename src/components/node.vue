<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from 'vue';
import { dragable } from '../utils/move'
import { useStore } from '../store'
import { storeToRefs } from 'pinia';
import { nanoid } from 'nanoid';
const store = useStore()
const { activeNodeId } = storeToRefs(store)


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

function handleMousedown(e: MouseEvent, dir: string) {
    const el = e!.currentTarget as HTMLElement
    if (!el) return
    // 画线
    const { x: dotX, y: dotY } = el.getBoundingClientRect()
    const { clientX, clientY } = e

    console.log(dotX, dotY, clientX, clientY)
    // 确定鼠标相对画布的开始点
    console.log(e)
    const tempLine = {
        id: nanoid(10),
        fromNode: id.value,
        toNode: '',
        fromDot: dir,
        toDot: '',
        fromX: dotX + 5, // 球的半径
        fromY: dotY + 5,
        toX: 0,
        toY: 0,
        temp: true
    }
    // 添加一个临时线
    store.addLine(tempLine)

    // 添加一个edge
    function _onMove(e: MouseEvent) {

        console.log(e.clientX, e.clientY)
        store.updateLine(tempLine.id, {
            toX: e.clientX,
            toY: e.clientY
        })
    }
    // 跟随鼠标位置，更新C曲线指令
    document.addEventListener('mousemove', _onMove)
    document.addEventListener('mouseup', function _onUp() {
        document.removeEventListener('mousemove', _onMove)
        document.removeEventListener('mouseup', _onUp)
    })
}

</script>

<template>
    <div class="node-container" ref="nodeEl" :class="{ 'is-active': isActive }" @mousedown="setActive(id)">
        {{ msg }}

        <template v-if="isActive">
            <div class="dot left" @mousedown="handleMousedown($event, 'l')"></div>
            <div class="dot right" @mousedown="handleMousedown($event, 'r')"></div>
            <div class="dot top" @mousedown="handleMousedown($event, 't')"></div>
            <div class="dot bottom" @mousedown="handleMousedown($event, 'b')"></div>
        </template>
        <!-- <div class="handles" v-if="isActive" @mousedown="handleMousedown($event)"></div> -->
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
    // .handles{
    //     position: absolute
    //     width: 100%
    //     height: 100%
    //     border: 2px solid blue
    //     border-radius 10px
    //     pointer-events: none
    // }
        .dot{
            position: absolute
            width: 10px
            height: 10px
            cursor pointer
            background lightblue
            border-radius: 50%
            transition: all 100ms linear
            &:hover{
                transform scale(1.2)
            }
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
</style>
