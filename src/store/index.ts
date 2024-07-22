import { nanoid } from "nanoid"
import { defineStore } from "pinia"

export const useStore = defineStore('store', {
    state: () => ({
        scale: 1,
        nodes: [],
        activeNodeId: ''
    }),
    getters: {
        // double: (state) => state.count * 2,
    },
    actions: {
        setScale(val: number) {
            this.scale = val
        },
        addNode() {
            console.log('addnode')
            const newNode = {
                id: nanoid(),
                content: `node ${this.nodes.length + 1}`
            }
            this.nodes.push(newNode as never)
            console.log(this.nodes)
            this.setActiveNodeId(newNode.id)
        },
        removeNode(nodeId: string) {
            if (nodeId === this.activeNodeId) {
                this.activeNodeId = ''
            }
            this.nodes = this.nodes.filter(({ id }) => id !== nodeId)
        },
        setActiveNodeId(id: string) {
            this.activeNodeId = id
        }
    },
})