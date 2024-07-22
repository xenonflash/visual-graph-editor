export enum NodeStatus {
    active,
    hover,
    normal
}

export interface INode {
    id: string,
    content: string,
    x: number,
    y: number,
    width: number,
    height: number,
    dots: IDot[],
    status: NodeStatus
}

export interface IDot {
    radius: number,
    left: number,
    top: number,
    dir: 'l' | 'r' | 'b' | 't'
}

export interface ILine{
    id: string,
    fromNode: string,
    toNode: string,
    fromDot: 'l' | 't' | 'b' | 'r',
    toDot: string,
    fromX: number, // 球的半径
    fromY: number,
    toX: number,
    toY: number,
    temp: boolean
}