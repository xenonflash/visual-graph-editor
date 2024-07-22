import { nanoid } from "nanoid"
import { defineStore, Store } from "pinia"
import { INode } from "../components/node.vue"
import { ILine } from "../components/line.vue"

type StoreData = {
    scale: number,
    nodes: INode[],
    lines: ILine[],
    activeNodeId: string,
    activeLineId: string
}

export const useStore = defineStore('store', {
    state: (): StoreData => ({
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
            const id = nanoid(10)
            const newNode: INode = {
                id,
                content: `node ${id}`,
                x: 0,
                y: 0,
                width: 100,
                height: 100
            }
            this.nodes.push(newNode as never)
            this.setActiveNodeId(id)
        },
        updateNodePos(nodeId: string, x: number, y: number) {
            const node = this.nodes.find(({ id }) => id === nodeId)
            if (!node) {
                return console.warn(`no node find ${nodeId}`)
            }

            Object.assign(node, { x, y })
            // 如果位置大小变化了。需要更新所有相关的线
            this.lines.forEach(line => {
                if (line.toNode === nodeId) {
                }
                if (line.fromNode === nodeId) {
                }
            })
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