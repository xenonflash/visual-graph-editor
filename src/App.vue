<script setup lang="ts">
import Board from './components/board.vue'

function handleAddNode() {}
function handleRemoveNode() {}
</script>

<template>
  <div class="navbar">
    <button @onclick="handleAddNode">添加</button>
    <button @onclick="handleRemoveNode">删除</button>
  </div>
  <Board/>
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
