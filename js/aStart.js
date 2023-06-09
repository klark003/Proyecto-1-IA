
function searchAStart() {
    const startPos = getStartPoint(environment);
    if (startPos) {
        console.log("Busqueda por A*");
        let t1 = performance.now();
        const result = aStart(environment, startPos);
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

function aStart(matrix, start) {
    const nodes = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    let arrayTotalGoals = getTotalCountGoals(matrix, true);
    let priorityQueue = new PriorityQueue();
    priorityQueue.enqueue([start, 0, heuristic(start, arrayTotalGoals), 0, [], []]);

    let costMatrix = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Infinity)
    );
    costMatrix[start[0]][start[1]] = 0;

    while (!priorityQueue.isEmpty()) {
        let [currentNode, currentCost, currentEstimatedCost, currentSeeds, currentPositionsRecolectedSeeds, currentPositionsDeletedEnemies] = priorityQueue.dequeue();

        if (currentCost > costMatrix[currentNode[0]][currentNode[1]]) {
            continue;
        }

        if (matrix[currentNode[0]][currentNode[1]] == 1) {
            continue;
        }
        if (matrix[currentNode[0]][currentNode[1]] == 6) {

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
                    costo: currentCost
                };
            } else {
                currentPositionsRecolectedSeeds.forEach(posSeed => {
                    matrix[posSeed[0]][posSeed[1]] = 0;
                })
                currentPositionsDeletedEnemies.forEach(posEnemy => {
                    matrix[posEnemy[0]][posEnemy[1]] = 0;
                })
                currentPositionsRecolectedSeeds = [];
                currentPositionsDeletedEnemies = [];
                priorityQueue = new PriorityQueue();
                costMatrix = Array.from({ length: rows }, () =>
                    Array.from({ length: cols }, () => Infinity)
                );
                costMatrix[currentNode[0]][currentNode[1]] = currentCost;
            }

        }

        for (const [i, j] of getNeighbors(currentNode, rows, cols)) {
            let neighborPositionsRecolectedSeeds = [];
            let neighborPositionsDeletedEnemies = [];
            let totalSeeds = 0;
            let neighborCost = 1;
            if (matrix[i][j] == 3) {// si hay un freezer
                if (currentSeeds > 0) {// si tengo semilla
                    neighborPositionsDeletedEnemies.push([i, j]);
                    totalSeeds = currentSeeds - 1;
                } else {// si no tengo
                    neighborCost = 4;
                }
            } else if (matrix[i][j] == 4) {// si hay un cell
                if (currentSeeds > 0) {// si tengo semilla
                    neighborPositionsDeletedEnemies.push([i, j]);
                    totalSeeds = currentSeeds - 1;
                } else {// si no tengo
                    neighborCost = 7;
                }
            } else if (matrix[i][j] == 5) {
                neighborPositionsRecolectedSeeds.push([i, j]);
                totalSeeds = currentSeeds + 1;
            } else {
                totalSeeds = currentSeeds;
            }

            const totalCost = currentCost + neighborCost;
            const totalPositionsRecolectedSeeds = currentPositionsRecolectedSeeds.concat(neighborPositionsRecolectedSeeds);
            const totalPositionsDeletedEnemies = currentPositionsDeletedEnemies.concat(neighborPositionsDeletedEnemies);

            if ((totalCost + currentEstimatedCost) < costMatrix[i][j]) {
                costMatrix[i][j] = totalCost;
                priorityQueue.enqueue([[i, j], totalCost, heuristic([i, j], arrayTotalGoals), totalSeeds, totalPositionsRecolectedSeeds, totalPositionsDeletedEnemies]);
                const node = new Node([[i, j], totalCost]);
                node.insertFather(new Node([currentNode, currentCost]));
                nodes.push(node);
            }
        }
    }

    return null;
}