
export default function getHandlePos(nodeW: number, nodeH: number, dir:'l'|'r'|'b'|'t') {
    let top = 0, left = 0
    if (dir === 'l') {
        top = nodeH / 2
        left = 0
    }
    if (dir === 'r') {
        top = nodeH / 2
        left = nodeW
    }
    if (dir === 't') {
        top = 0
        left = nodeH / 2
    }
    if (dir === 'b') {
        top = nodeH
        left = nodeW / 2
    }
    return {
        top: top - 7,
        left: left - 7
    }
}