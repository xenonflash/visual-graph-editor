<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Board from './components/board.vue'
import PropsPanel from './components/props-panel.vue'
import LeftPanel from './components/left-panel.vue'
import { useStore } from './store'
const store = useStore()
const { addNode, removeNode } = store
const { activeNodeId } = storeToRefs(store)

function handleAddNode() {
  console.log('add')
  addNode()
}
function handleRemoveNode() {
  removeNode(activeNodeId.value)
}
</script>

<template>
  <!-- 顶部栏 -->
  <div class="navbar">
    <button @click="handleAddNode">添加</button>
    <button :disabled="activeNodeId.length < 1" @click="handleRemoveNode">删除</button>
  </div>
  <section>
    <!-- 左侧 -->
    <LeftPanel />

    <!-- 中间画板 -->
    <Board />

    <!-- 右侧 -->
    <PropsPanel />
  </section>

</template>

<style scoped lang="stylus">
.navbar{
  border-bottom 1px solid #ccc
  display flex
  align-items center
  height: 60px
  button {
    margin: 0 10px
    padding: 0 7px
  }
}
section{
  display flex
  height 100%
  flex-shrink: 0
}
</style>
