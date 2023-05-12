

// Algoritmo A* adaptado para búsqueda informada
function aStarSearch(matrix, start) {
    const nodes = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    const visited = new Set();

    let arrayTotalGoals = getTotalCountGoals(matrix, true);
    let priorityQueue = new PriorityQueue();
    priorityQueue.enqueue([start, heuristic(start, arrayTotalGoals)]);

    while (!priorityQueue.isEmpty()) {

        let [currentNode, currentEstimatedCost] = priorityQueue.dequeue();
        visited.add(currentNode.join(","));

        if (matrix[currentNode[0]][currentNode[1]] == 6) {
            visited.clear();
            matrix[currentNode[0]][currentNode[1]] = 0;
            for (let i = 0; i < arrayTotalGoals.length; i++) {
                const goal = arrayTotalGoals[i];
                if (goal[0] == currentNode[0] && goal[1] == currentNode[1]) {
                    arrayTotalGoals.splice(i, 1);
                    break;
                }
            }
            if (arrayTotalGoals.length == 0) {
                let current = undefined;
                const roat = []
                for (let i = nodes.length - 1; i > -1; i--) {
                    const node = nodes[i].node;
                    if (node[0][0] == currentNode[0] && node[0][1] == currentNode[1]) {
                        current = nodes[i];
                        roat.push(current.node[0]);
                        break;
                    }
                }
                for (let i = nodes.length - 1; i > -1; i--) {
                    const father = nodes[i].node;
                    const node = current.father.node;
                    if (father[1] == node[1] && father[0][0] == node[0][0] && father[0][1] == node[0][1]) {
                        current = nodes[i];
                        roat.unshift(current.node[0]);
                    }
                }
                roat.unshift(current.father.node[0])
                return {
                    roat: roat,
                    depth: roat.length - 1,
                    nodes: nodes,
                    cost: currentEstimatedCost
                };
            }

        }
        let neighbor = undefined;
        let lowerNeighborCost = Infinity;

        for (const [i, j] of getNeighbors(currentNode, rows, cols)) {
            const neighborCost = heuristic([i, j], arrayTotalGoals);
            if (neighborCost < lowerNeighborCost && matrix[i][j] != 1 && !visited.has([i, j].join(","))) {
                lowerNeighborCost = neighborCost;
                neighbor = [i, j];
            }
        }
        if (neighbor) {
            priorityQueue.enqueue([neighbor, lowerNeighborCost]);
            const node = new Node([neighbor, lowerNeighborCost]);
            node.insertFather(new Node([currentNode, currentEstimatedCost]));
            nodes.push(node);
        }else{
            priorityQueue.enqueue([currentNode, currentEstimatedCost]);
            visited.clear();
        }
    }

    return null;
}




let matrix = [
    [0, 5, 3, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 3, 5, 1, 0, 2, 0],
    [0, 1, 1, 1, 3, 1, 1, 1, 1, 0],
    [6, 5, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 4, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 4, 4, 0, 0, 1, 1, 5],
    [1, 1, 0, 0, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 5, 0, 0, 0],
    [1, 1, 1, 6, 1, 1, 0, 1, 1, 1]
]

const start = [2, 8];

const path = aStarSearch(matrix, start);
console.log(path)