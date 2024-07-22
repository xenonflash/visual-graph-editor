import { nanoid } from "nanoid"
import { defineStore, Store } from "pinia"

export const useStore = defineStore('store', {
    state: () => ({
        scale: 1,
        nodes: [],
        lines: [],
        activeNodeId: '',
        activeLineId: ''
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
            const id = nanoid(10)
            const newNode = {
                id,
                content: `node ${id}`
            }
            this.nodes.push(newNode as never)
            console.log(this.nodes)
            this.setActiveNodeId(id)
        },
        removeNode(nodeId: string) {
            if (nodeId === this.activeNodeId) {
                this.activeNodeId = ''
            }
            this.nodes = this.nodes.filter(({ id }) => id !== nodeId)
        },
        setActiveNodeId(id: string) {
            this.activeNodeId = id
        },
        addLine(newLine: any) {
            this.lines.push(newLine as never)
            this.setActiveLineId(newLine!.id)
        },
        removeLine(lineId: string) {
            if (lineId === this.activeLineId) {
                this.activeLineId = ''
            }
            this.lines = this.lines.filter(({ id }) => id !== lineId)
        },
        updateLine(lineId: string, params = {}) {
            const line = this.lines.find(({ id }) => id === lineId)
            if (!line) {
                console.warn(`no that line: ${lineId}`)
                return
            }
            Object.assign(line, params)
        },
        setActiveLineId(id: string) {
            this.activeLineId = id
        },
    },
})