<template>
    <div class="container">
        <div class="board" ref="boardEl">
            <Node v-for="item in nodes" :msg="item.content" :id="item.id" />

            <!-- 辅助线 -->
            <!-- 连接线 -->
             <svg width="100%" height="100%">
                <Line v-for="line in lines" :fromX="line.fromX" :fromY="line.fromY" :toX="line.toX" :toY="line.toY"/>
             </svg>
            
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { dragable, zoomable } from '../utils/move';
import Node from '../components/node.vue'
import Line from '../components/line.vue'
import { useStore } from '../store'
import { storeToRefs } from 'pinia';
const { nodes, lines} = storeToRefs(useStore())
console.log(nodes.value)

const boardEl = ref(null)

onMounted(function () {
    // dragable(boardEl.value!)
    // zoomable(boardEl.value!)
})
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