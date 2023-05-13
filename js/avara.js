function searchAvara() {
    const startPos = getStartPoint(environment);
    if (startPos) {
        console.log("Busqueda por Avara");
        let t1 = performance.now();
        const result = avara(environment, startPos);
        let t2 = performance.now();
        let txtSolution = `Road time: ${t2 - t1} ms\n`;
        console.log(result.camino);
        for (const key in result) {
            if(key != "camino"){
                txtSolution += `${key}: ${result[key]}\n`;
            }
        }
        document.getElementById("solution").innerText = txtSolution;
        showSolution(result.camino, 0);
    } else {
        alert("No se encontro el punto de partida");
    }
}


function avara(matrix, start) {
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
                    camino: roat,
                    profundidad: roat.length - 1,
                    totalNodosExpandidos: nodes.length,
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
