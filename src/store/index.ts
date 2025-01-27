import { nanoid } from "nanoid"
import { defineStore, Store } from "pinia"
import { IDot, INode } from "../typings"
import { ILine } from "../typings"
import getHandlePos from "../utils/getHandlePos"
import { NodeStatus } from "../typings/index"

type StoreData = {
    transform: {
        x: number
        y: number
        scale: number
    }
    scale: number,
    nodes: INode[],
    lines: ILine[],
    activeNodeId: string,
    activeLineId: string,
    hoverDot: IDot | null
    hoverNodeId: string | undefined,
    history: {
        past: Array<{nodes: INode[], lines: ILine[]}>,
        future: Array<{nodes: INode[], lines: ILine[]}>
    }
}

export const useStore = defineStore('store', {
    state: (): StoreData => ({
        transform: {
            x: 0,
            y: 0,
            scale: 1
        },
        scale: 1,
        nodes: [],
        lines: [],
        activeNodeId: '',
        activeLineId: '',
        hoverNodeId: '',
        hoverDot: null,
        history: {
            past: [],
            future: []
        }
    }),
    getters: {
        activeNode: (state) => state.nodes.find(({ id }) => id === state.activeNodeId),
        activeLine: (state) => state.lines.find(({ id }) => id === state.activeLineId),
        hoverNode: (state) => state.nodes.find(({ id }) => id === state.hoverNodeId),
    },
    actions: {
        updateTransform(transform: Partial<StoreData['transform']>) {
            this.transform = {
                ...this.transform,
                ...transform
            }
        },
        setScale(val: number) {
            this.scale = val
        },
        addNode(type: string = 'rect') {
            this.saveToHistory()
            const id = nanoid(10)
            // 计算新节点的位置，基于已有节点数量进行偏移
            const offset = this.nodes.length * 20
            const baseX = 100
            const baseY = 100

            // 根据类型设置不同的属性
            const commonProps = {
                id,
                content: type === 'rect' ? '矩形节点' : type === 'diamond' ? '菱形节点' : '圆形节点',
                x: baseX + offset,
                y: baseY + offset,
                status: NodeStatus.normal,
                type: type // 添加type属性
            }

            let nodeConfig: INode
            if (type === 'diamond') {
                const size = 70; // 节点大小
                const dotSize = 10; // 连接点大小（包括边框）
                const offset = dotSize / 2; // 居中偏移量
                nodeConfig = {
                    ...commonProps,
                    width: size,
                    height: size,
                    dots: [
                        {
                            dir: 'l',
                            radius: dotSize/2,
                            left: -offset,
                            top: (size/2) - offset
                        },
                        {
                            dir: 'r',
                            radius: dotSize/2,
                            left: size - offset,
                            top: (size/2) - offset
                        },
                        {
                            dir: 't',
                            radius: dotSize/2,
                            left: (size/2) - offset,
                            top: -offset
                        },
                        {
                            dir: 'b',
                            radius: dotSize/2,
                            left: (size/2) - offset,
                            top: size - offset
                        }
                    ]
                }
            } else if (type === 'circle') {
                const size = 80; // 节点大小
                const dotSize = 10; // 连接点大小（包括边框）
                const offset = dotSize / 2; // 居中偏移量
                nodeConfig = {
                    ...commonProps,
                    width: size,
                    height: size,
                    dots: [
                        {
                            dir: 't',
                            radius: dotSize/2,
                            left: (size/2) - offset,
                            top: -offset
                        },
                        {
                            dir: 'r',
                            radius: dotSize/2,
                            left: size - offset,
                            top: (size/2) - offset
                        },
                        {
                            dir: 'b',
                            radius: dotSize/2,
                            left: (size/2) - offset,
                            top: size - offset
                        },
                        {
                            dir: 'l',
                            radius: dotSize/2,
                            left: -offset,
                            top: (size/2) - offset
                        }
                    ]
                }
            } else {
                // 默认节点配置
                const width = 120;
                const height = 60;
                const dotSize = 10;
                const offset = dotSize / 2;
                
                nodeConfig = {
                    ...commonProps,
                    width,
                    height,
                    dots: [
                        {
                            dir: 'l',
                            radius: dotSize/2,
                            left: -offset,
                            top: (height/2) - offset
                        },
                        {
                            dir: 'r',
                            radius: dotSize/2,
                            left: width - offset,
                            top: (height/2) - offset
                        },
                        {
                            dir: 't',
                            radius: dotSize/2,
                            left: (width/2) - offset,
                            top: -offset
                        },
                        {
                            dir: 'b',
                            radius: dotSize/2,
                            left: (width/2) - offset,
                            top: height - offset
                        }
                    ]
                }
            }

            this.nodes.push(nodeConfig as never)
            this.setActiveNodeId(id)
        },
        updateNodePos(id: string, x: number, y: number) {
            const node = this.nodes.find(n => n.id === id)
            if (node) {
                node.x = x
                node.y = y
                // 更新连接到该节点的所有连线
                this.updateNodeLines(node)
            }
        },
        updateNodeSize(id: string, width: number, height: number) {
            const node = this.nodes.find(n => n.id === id)
            if (!node) return
            
            // 保存历史记录
            this.saveToHistory()
            
            // 更新节点大小
            node.width = width
            node.height = height
            
            // 更新连接点位置
            if (node.dots) {
                const dotSize = 12 // 连接点大小
                const offset = dotSize / 2 // 居中偏移量
                
                node.dots.forEach(dot => {
                    switch(dot.dir) {
                        case 't':
                            dot.left = (width/2) - offset
                            dot.top = -offset
                            break
                        case 'r':
                            dot.left = width - offset
                            dot.top = (height/2) - offset
                            break
                        case 'b':
                            dot.left = (width/2) - offset
                            dot.top = height - offset
                            break
                        case 'l':
                            dot.left = -offset
                            dot.top = (height/2) - offset
                            break
                    }
                })
            }
            
            // 更新连接到该节点的所有连线
            this.lines.forEach(line => {
                if (line.fromNode === id) {
                    const dot = node.dots.find(d => d.dir === line.fromDot)
                    if (dot) {
                        line.fromX = node.x + dot.left + 6 // 加上连接点半径
                        line.fromY = node.y + dot.top + 6
                    }
                }
                if (line.toNode === id) {
                    const dot = node.dots.find(d => d.dir === line.toDot)
                    if (dot) {
                        line.toX = node.x + dot.left + 6
                        line.toY = node.y + dot.top + 6
                    }
                }
            })
        },
        removeNode(nodeId: string) {
            this.saveToHistory()
            if (nodeId === this.activeNodeId) {
                this.activeNodeId = ''
            }
            // 删除与该节点相关的所有连接线
            this.lines = this.lines.filter(line => line.fromNode !== nodeId && line.toNode !== nodeId)
            // 删除节点
            this.nodes = this.nodes.filter(({ id }) => id !== nodeId)
        },
        setActiveNodeId(id: string = '') {
            this.activeNodeId = id
        },
        addLine(newLine: any) {
            this.saveToHistory()
            this.lines.push(newLine as never)
            this.setActiveLineId(newLine!.id)
        },
        removeLine(lineId: string) {
            this.saveToHistory()
            if (lineId === this.activeLineId) {
                this.activeLineId = ''
            }
            this.lines = this.lines.filter(({ id }) => id !== lineId)
        },
        updateLine(lineId: string, params: Partial<ILine> = {}) {
            const line = this.lines.find(({ id }) => id === lineId)
            if (!line) {
                console.warn(`no that line: ${lineId}`)
                return
            }
            Object.assign(line, params)
        },
        setActiveLineId(id: string = '') {
            this.activeLineId = id
        },
        setMouseOnDot(dot: IDot | null) {
            this.hoverDot = dot
        },
        setMouseOnNode(nodeId: string | undefined) {
            this.hoverNodeId = nodeId
        },
        saveToHistory() {
            this.history.past.push({
                nodes: JSON.parse(JSON.stringify(this.nodes)),
                lines: JSON.parse(JSON.stringify(this.lines))
            })
            // 清空future，因为新的操作会改变历史
            this.history.future = []
        },
        undo() {
            if (this.history.past.length === 0) return
            
            // 保存当前状态到future
            this.history.future.push({
                nodes: JSON.parse(JSON.stringify(this.nodes)),
                lines: JSON.parse(JSON.stringify(this.lines))
            })
            
            // 恢复上一个状态
            const previousState = this.history.past.pop()!
            this.nodes = previousState.nodes
            this.lines = previousState.lines
            
            // 清除选中状态
            this.activeNodeId = ''
            this.activeLineId = ''
        },
        redo() {
            if (this.history.future.length === 0) return
            
            // 保存当前状态到past
            this.history.past.push({
                nodes: JSON.parse(JSON.stringify(this.nodes)),
                lines: JSON.parse(JSON.stringify(this.lines))
            })
            
            // 恢复下一个状态
            const nextState = this.history.future.pop()!
            this.nodes = nextState.nodes
            this.lines = nextState.lines
            
            // 清除选中状态
            this.activeNodeId = ''
            this.activeLineId = ''
        },
        updateNodeContent(nodeId: string, content: string) {
            this.saveToHistory()
            const node = this.nodes.find(n => n.id === nodeId)
            if (!node) {
                return console.warn(`no node find ${nodeId}`)
            }
            node.content = content
        },
        updateNodeLines(node: INode) {
            this.lines.forEach(line => {
                if (line.toNode === node.id) {
                    const dir = line.toDot
                    const dotData = node.dots.find(({ dir: _dir }) => _dir === dir)!
                    Object.assign(line, {
                        toX: node.x + dotData.left,
                        toY: node.y + dotData.top
                    })
                }
                if (line.fromNode === node.id) {
                    const dir = line.fromDot
                    const dotData = node.dots.find(({ dir: _dir }) => _dir === dir)!
                    Object.assign(line, {
                        fromX: node.x + dotData.left,
                        fromY: node.y + dotData.top
                    })
                }
            })
        },
        copyNode(id: string) {
            const node = this.nodes.find(n => n.id === id)
            if (node) {
                const newNode = {
                    ...node,
                    id: nanoid(),
                    x: node.x + 20,
                    y: node.y + 20
                }
                this.nodes.push(newNode)
                this.activeNodeId = newNode.id
            }
        },
    },

})