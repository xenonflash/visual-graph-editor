<template>
    <div class="toolbar">
        <button class="toolbar-btn" @click="store.addNode()">
            <div class="icon square"></div>
            <span>方形节点</span>
        </button>
        <button class="toolbar-btn" @click="store.addNode('diamond')">
            <div class="icon diamond"></div>
            <span>菱形节点</span>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from '../store'

const store = useStore()
</script>

<style lang="stylus" scoped>
.toolbar {
    position: fixed
    top: 20px
    left: 50%
    transform: translateX(-50%)
    display: flex
    gap: 10px
    padding: 8px
    background: #fff
    border-radius: 8px
    box-shadow: 0 2px 8px rgba(0,0,0,0.1)
}

.toolbar-btn {
    display: flex
    flex-direction: column
    align-items: center
    gap: 4px
    padding: 8px
    border: none
    background: transparent
    cursor: pointer
    border-radius: 4px
    
    &:hover {
        background: #f5f5f5
    }
    
    span {
        font-size: 12px
        color: #666
    }
}

.icon {
    width: 24px
    height: 24px
    border: 2px solid #666
    
    &.square {
        border-radius: 2px
    }
    
    &.diamond {
        transform: rotate(45deg)
        border-radius: 2px
    }
}
</style>
