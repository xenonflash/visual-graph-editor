<script setup lang="ts">
import Board from './components/board.vue'
import PropsPanel from './components/props-panel.vue'
import LeftPanel from './components/left-panel.vue'
import Toolbar from './components/toolbar.vue'
</script>

<template>
  <div class="app">
    <Toolbar />
    <section class="main-content">
      <LeftPanel />
      <div class="center-area">
        <Board />
      </div>
      <PropsPanel />
    </section>
  </div>
</template>

<style>
:root {
  --border-color: rgba(0,0,0,0.08);
  --hover-color: rgba(0,0,0,0.04);
  --active-color: #daebf7;
  --text-primary: #333;
  --text-secondary: #666;
  --bg-primary: #fff;
  --bg-secondary: #fafafa;
  --font-size-small: 11px;
  --font-size-normal: 12px;
  --radius-small: 2px;
  --radius-normal: 4px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-primary);
  font-size: var(--font-size-normal);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  font-family: inherit;
}
</style>

<style scoped lang="stylus">
.app {
  width: 100vw
  height: 100vh
  display: flex
  flex-direction: column
  background: var(--bg-secondary)
}

.main-content {
  flex: 1
  display: flex
  padding-top: 48px
  overflow: hidden
}

.center-area {
  flex: 1
  overflow: hidden
  position: relative
  background: var(--bg-secondary)
  
  &::before {
    content: ''
    position: absolute
    top: 0
    left: 0
    right: 0
    height: 1px
    background: var(--border-color)
    z-index: 1
  }
}
</style>
