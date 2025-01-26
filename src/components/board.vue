<template>
    <div class="container">
        <div class="board" ref="boardEl" @click="handleBoardClick">
            <base-node v-for="item in nodes" :data="item" />

            <!-- 辅助线 -->
            <!-- 连接线 -->
            <svg width="100%" height="100%">
                <defs>
                    <marker id='head' orient="auto" markerWidth='3' markerHeight='4' refX='0.1' refY='2'>
                        <path d='M0,0 V4 L2,2 Z' fill="lightblue" />
                    </marker>
                </defs>
                <Line v-for="line in lines" 
                    :fromX="line.fromX" 
                    :fromY="line.fromY" 
                    :toX="line.toX" 
                    :toY="line.toY"
                    :fromDot="line.fromDot"
                    :toDot="line.toDot" />
            </svg>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { dragable, zoomable } from '../utils/move';
import BaseNode from './base-node/base-node.vue'
import Line from '../components/line.vue'
import { useStore } from '../store'
import { storeToRefs } from 'pinia';
const store = useStore()
const { nodes, lines } = storeToRefs(store)


const boardEl = ref()


onMounted(function () {
    // 设置画板全局 变换 数据到store
    setupBoardTransform()
    // dragable(boardEl.value!)
    // zoomable(boardEl.value!)
})

function setupBoardTransform() {
    const { x, y, width, height } = boardEl.value!.getBoundingClientRect()
    
}

function handleBoardClick(e) {
    // 如果当前点击的不是 线段 / node 取消点击
    if(!(['base-node', 'line'].includes(e.target.dataset?.role))) {
        // 取消当前选中node
        store.setActiveNodeId()
    }
}
</script>

<style lang="stylus" scoped>
.container{
    display flex
    flex 1
    background #ddd
    height 100%
    position relative
    overflow hidden
    border: 15px solid #eee
}
.board{
    position absolute
    width: 100%
    height 100%
    background-color #fff
    background-size: 40px 40px;
    background-image: radial-gradient(circle, #999 1px, rgba(0, 0, 0, 0) 1px);
}
</style>