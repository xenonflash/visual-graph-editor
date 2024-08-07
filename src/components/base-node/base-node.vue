<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch } from 'vue';
import { dragable } from '../../utils/move'
import { useStore } from '../../store'
import { storeToRefs } from 'pinia';
import { nanoid } from 'nanoid';
import { IDot, ILine, INode } from '../../typings';


const store = useStore()
const { activeNodeId, hoverNodeId, hoverNode, hoverDot } = storeToRefs(store)


const nodeEl = ref()

const props = defineProps<{ data: INode }>()
const { data } = toRefs(props)

const isActive = computed(() => {
    return activeNodeId.value === data.value.id
})
const isHover = computed(() => {
    return hoverNodeId?.value === data.value.id
})

onMounted(() => {
    dragable(nodeEl.value!, false, false, updateOnMove)
})

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
        fromX: dotX + 5 - 200, // 球的半径
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
            toX: e.clientX - 200,
            toY: e.clientY
        })
    }
    // 跟随鼠标位置，更新C曲线指令
    document.addEventListener('mousemove', _onMove)

    document.addEventListener('mouseup', function _onUp() {
        //如果鼠标有当前落在的dot上，就连线
        const toDot = hoverDot?.value
        const toNode = hoverNode.value
        if (toDot) {
            console.log(toDot)
            store.updateLine(tempLine.id, {
                toDot: toDot.dir,
                toX: toNode.x + toDot.left,
                toY: toNode.y + toDot.top,
                toNode: hoverNode.value.id
            })
        } else {
            store.removeLine(tempLine.id)
        }
        // 否则删掉刚才的线
        document.removeEventListener('mousemove', _onMove)
        document.removeEventListener('mouseup', _onUp)
    })
}


function handleDotEnter(dot: IDot) {
    console.log('enter', dot)
    store.setMouseOnDot(dot)
}
function handleDotLeave() {
    console.log('leave')
    store.setMouseOnDot(null)
}
function handleNodeEnter(nodeId: string) {
    store.setMouseOnNode(nodeId)
}
function handleNodeLeave() {
    store.setMouseOnNode(undefined)
}

</script>

<template>
    <div data-role="base-node" class="node-container" ref="nodeEl" :class="{ 'is-active': isActive, 'is-hover': isHover }"
        @mousedown="setActive(data.id)" @mouseenter="handleNodeEnter(data.id)" @mouseleave="handleNodeLeave()">
        {{ data.content }}
        <template v-if="isActive || isHover">
            <div v-for="dot in data.dots" :style="{ top: dot.top + 'px', left: dot.left + 'px' }" :class="`dot ${dot.dir}`"
                @mousedown="handleMousedown($event, dot.dir)" @mouseenter="handleDotEnter(dot)"
                @mouseleave="handleDotLeave()"></div>
        </template>
        <!-- <div class="handles" v-if="isActive" @mousedown="handleMousedown($event)"></div> -->
    </div>
</template>

<style scoped lang="stylus">
    .node-container{
        width 100px
        min-height 100px
        border-radius: 10px
        background rgba(255,255,255,.5)
        position: absolute
        display flex
        align-items: center
        justify-content: center
        border: 2px solid #ccc
        padding: 10px
        font-size 12px
        box-sizing border-box
    }
    .is-hover{
        border-color pink
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
