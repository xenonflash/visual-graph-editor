<template>
    <Teleport to="body">
        <div v-if="visible" 
             class="context-menu"
             :style="{ left: x + 'px', top: y + 'px' }"
             @contextmenu.prevent>
            <div class="menu-items">
                <button v-for="item in items" 
                        :key="item.key"
                        class="menu-item"
                        @click="handleClick(item)">
                    <div class="item-icon" :class="item.icon"></div>
                    <span>{{ item.label }}</span>
                    <span v-if="item.shortcut" class="shortcut">{{ item.shortcut }}</span>
                </button>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface MenuItem {
    key: string
    label: string
    icon?: string
    shortcut?: string
    handler: () => void
}

interface Props {
    visible: boolean
    x: number
    y: number
    items: MenuItem[]
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const handleClick = (item: MenuItem) => {
    item.handler()
    emit('close')
}

const handleClickOutside = (e: MouseEvent) => {
    if (props.visible) {
        emit('close')
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('contextmenu', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('contextmenu', handleClickOutside)
})
</script>

<style lang="stylus" scoped>
.context-menu {
    position: fixed
    z-index: 1000
    min-width: 160px
    padding: 4px
    background: #fff
    border-radius: 6px
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15),
                0 0 1px rgba(0, 0, 0, 0.08),
                0 16px 24px rgba(0, 0, 0, 0.04)
    backdrop-filter: blur(8px)
    background: rgba(255, 255, 255, 0.98)
    animation: menu-fade .1s ease-out
}

.menu-items {
    display: flex
    flex-direction: column
    gap: 1px
}

.menu-item {
    display: flex
    align-items: center
    gap: 8px
    padding: 6px 8px
    border: none
    background: transparent
    cursor: pointer
    border-radius: 4px
    color: #333
    font-size: 12px
    height: 28px
    transition: all 0.15s
    position: relative
    
    &:hover {
        background: rgba(0, 0, 0, 0.04)
        color: #1890ff
        
        .item-icon {
            opacity: 1
            transform: scale(1.1)
        }
    }
    
    &:active {
        background: rgba(24, 144, 255, 0.1)
        transform: scale(0.98)
    }
    
    span {
        flex: 1
        text-align: left
        font-weight: 500
    }
    
    .shortcut {
        flex: none
        font-size: 11px
        color: #999
        font-weight: normal
    }
}

.item-icon {
    width: 14px
    height: 14px
    opacity: 0.6
    position: relative
    transition: all 0.15s
    
    &.copy {
        &::before {
            content: ''
            position: absolute
            width: 10px
            height: 12px
            border: 1.2px solid currentColor
            border-radius: 2px
            top: 0
            left: 0
        }
        
        &::after {
            content: ''
            position: absolute
            width: 10px
            height: 12px
            border: 1.2px solid currentColor
            border-radius: 2px
            top: 2px
            left: 2px
            background: #fff
        }
    }
    
    &.delete {
        &::before, &::after {
            content: ''
            position: absolute
            width: 14px
            height: 1.2px
            background: currentColor
            top: 50%
            left: 50%
        }
        &::before {
            transform: translate(-50%, -50%) rotate(45deg)
        }
        &::after {
            transform: translate(-50%, -50%) rotate(-45deg)
        }
    }
}

@keyframes menu-fade {
    from {
        opacity: 0
        transform: scale(0.95)
    }
    to {
        opacity: 1
        transform: scale(1)
    }
}
</style>
