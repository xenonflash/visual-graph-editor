<script setup lang="ts">
import Board from './components/board.vue'
import PropsPanel from './components/props-panel.vue'
import LeftPanel from './components/left-panel.vue'
import Toolbar from './components/toolbar.vue'
</script>

<template>
  <Toolbar />
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
section {
  display: flex
  height: 100%
  flex-shrink: 0
  padding-top: 60px
}
</style>
