<script setup lang="ts">
import Board from './components/board.vue'
import { useStore } from './store'

const { addNode, removeNode, activeNodeId} = useStore()

function handleAddNode() {
  console.log('add')
  addNode()
}
function handleRemoveNode(nodeId: string) {
  removeNode(nodeId)
}
</script>

<template>
  <div class="navbar">
    <button @click="handleAddNode">添加</button>
    <button :disabled="activeNodeId.length < 1" @click="handleRemoveNode">删除</button>
  </div>
  <Board />
</template>

<style scoped lang="stylus">
.navbar{
  border-bottom 1px solid #ccc
  height 60px
  display flex
  align-items center
  button {
    margin: 0 10px
    padding: 0 7px
  }
}
</style>
