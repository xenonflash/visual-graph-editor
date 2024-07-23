import { nanoid } from "nanoid"
import { defineStore, Store } from "pinia"
import { IDot, INode } from "../typings"
import { ILine } from "../typings"
import getHandlePos from "../utils/getHandlePos"
import { NodeStatus } from "../typings/index"

type StoreData = {
    scale: number,
    nodes: INode[],
    lines: ILine[],
    activeNodeId: string,
    activeLineId: string,
    hoverDot: IDot | null
    hoverNodeId: string | undefined
}

export const useStore = defineStore('store', {
    state: (): StoreData => ({
        scale: 1,
        nodes: [],
        lines: [],
        activeNodeId: '',
        activeLineId: '',
        hoverNodeId: '',
        hoverDot: null
    }),
    getters: {
        activeNode: (state) => state.nodes.find(({id}) => id === state.activeNodeId),
        activeLine: (state) => state.lines.find(({id}) => id === state.activeLineId),
        hoverNode: (state) => state.nodes.find(({id}) => id === state.hoverNodeId),
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
                x: ~~Math.random() * 200 + 100,
                y: ~~Math.random() * 200 + 100,
                width: 100,
                height: 100,
                status: NodeStatus.normal,
                dots: [
                    {
                        dir: 'l',
                        radius: 10,
                        left: 0 - 6,
                        top: 50 - 6
                    },
                    {
                        dir: 'r',
                        radius: 10,
                        left: 100 - 8,
                        top: 50 - 8
                    },
                    {
                        dir: 't',
                        radius: 10,
                        left: 50 - 6,
                        top: 0 - 6
                    },
                    {
                        dir: 'b',
                        radius: 10,
                        left: 50 - 8,
                        top: 100 - 8
                    }
                ]
            }
            this.nodes.push(newNode as never)
            this.setActiveNodeId(id)
        },
        updateNodePos(nodeId: string, x: number, y: number) {
            const node = this.activeNode
            if (!node) {
                return console.warn(`no node find ${nodeId}`)
            }

            Object.assign(node, { x, y })
            // 如果位置大小变化了。需要更新所有相关的线
            this.lines.forEach(line => {
                const dir = line.fromDot
                const dotData = node.dots.find(({dir: _dir}) => _dir === dir)!
                if (line.toNode === nodeId) {
                    Object.assign(line, {
                        toX: x + dotData.left,
                        toY: y + dotData.top
                    })
                }
                if (line.fromNode === nodeId) {
                    Object.assign(line, {
                        fromX: x + dotData.left,
                        fromY: y + dotData.top
                    })
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
        updateLine(lineId: string, params: Partial<ILine> = {}) {
            const line = this.activeLine
            if (!line) {
                console.warn(`no that line: ${lineId}`)
                return
            }
            Object.assign(line, params)
        },
        setActiveLineId(id: string) {
            this.activeLineId = id
        },
        setMouseOnDot(dot: IDot| null) {
            this.hoverDot = dot
        },
        setMouseOnNode(nodeId: string | undefined) {
            this.hoverNodeId = nodeId
        }
    },

})