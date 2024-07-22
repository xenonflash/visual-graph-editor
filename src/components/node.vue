<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch } from 'vue';
import { dragable } from '../utils/move'
import { useStore } from '../store'
import { storeToRefs } from 'pinia';
import { nanoid } from 'nanoid';
import { ILine } from './line.vue';
import getHandlePos from '../utils/getHandlePos';

export interface INode {
    id: string,
    content: string,
    x: number,
    y: number,
    width: number,
    height: number
}




const store = useStore()
const { activeNodeId, nodes } = storeToRefs(store)


const nodeEl = ref()

const props = defineProps<{ data: INode }>()
const { data } = toRefs(props)

const isActive = computed(() => activeNodeId.value === data.value.id)

onMounted(() => {
    dragable(nodeEl.value!, false, false, updateOnMove)
})

function handlePos(dir) {
    const node = nodes.value.find(({ id: _id }) => _id === data.value.id)
    const { top, left } = getHandlePos(node.width, node.height, dir)
    return {
        top,
        left
    }
}

function updateOnMove(e: MouseEvent, x: number, y: number) {
    // 更新线
    store.updateNodePos(data.value.id, x + 20, y + 82) //TODO: 全局管理画布offset
}

function setActive(id: string) {
    store.setActiveNodeId(id)
}

function handleMousedown(e: MouseEvent, dir: string) {
    const el = e!.currentTarget as HTMLElement
    if (!el) return
    // 画线
    const { x: dotX, y: dotY } = el.getBoundingClientRect()

    // 确定鼠标相对画布的开始点
    const tempLine: ILine = {
        id: nanoid(10),
        fromNode: data.value.id,
        toNode: '',
        fromDot: dir,
        toDot: '',
        fromX: dotX + 5, // 球的半径
        fromY: dotY + 5,
        toX: -1,
        toY: -1,
        temp: true
    }
    // 添加一个临时线
    store.addLine(tempLine)

    // 添加一个edge
    function _onMove(e: MouseEvent) {

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
    <div
        class="node-container"
        ref="nodeEl"
        :class="{ 'is-active': isActive }"
        @mousedown="setActive(data.id)"
    >
        {{ data.content }}
        <template v-if="isActive">
            <div :style="{ top: handlePos('l').top + 'px', left: handlePos('l').left + 'px' }" class="dot left"
                @mousedown="handleMousedown($event, 'l')"></div>
            <div :style="{ top: handlePos('r').top + 'px', left: handlePos('r').left + 'px' }" class="dot right"
                @mousedown="handleMousedown($event, 'r')"></div>
            <div :style="{ top: handlePos('t').top + 'px', left: handlePos('t').left + 'px' }" class="dot top"
                @mousedown="handleMousedown($event, 't')"></div>
            <div :style="{ top: handlePos('b').top + 'px', left: handlePos('b').left + 'px' }" class="dot bottom"
                @mousedown="handleMousedown($event, 'b')"></div>
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
</style>
