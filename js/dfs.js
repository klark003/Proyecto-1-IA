

function searchDFS() {
    const startPos = getStartPoint(environment);
    if (startPos) {
        console.log("Busqueda por Profundidad");
        let t1 = performance.now();
        const nodes = [];
        const rows = environment.length;
        const cols = environment[0].length;
        let totalGoals = getTotalCountGoals(environment);
        const matrixVisited = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => false)
        );
        const result = DFS(environment, startPos, matrixVisited, 0, totalGoals, rows, cols, nodes);
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

function DFS(environment, currentNode, matrixVisited, goals, countTotalGoals, rows, cols, nodes) {
    matrixVisited[currentNode[0]][currentNode[1]] = true;

    if (environment[currentNode[0]][currentNode[1]] == 1) {
        return false;
    }

    if (environment[currentNode[0]][currentNode[1]] == 6) {
        environment[currentNode[0]][currentNode[1]] = 0;
        goals++;
        if (goals == countTotalGoals) {
            let current = undefined;
            const roat = []
            for (let i = nodes.length - 1; i > -1; i--) {
                const node = nodes[i].node;
                if (node[0] == currentNode[0] && node[1] == currentNode[1]) {
                    current = nodes[i];
                    roat.push(current.node);
                    break;
                }
            }
            for (let i = nodes.length - 1; i > -1; i--) {
                const father = nodes[i].node;
                const node = current.father.node;
                if (father[0] == node[0] && father[1] == node[1]) {
                    current = nodes[i];
                    roat.unshift(current.node);
                }
            }
            roat.unshift(current.father.node)
            return {
                camino: roat,
                profundidad: roat.length - 1,
                totalNodosExpandidos: nodes.length,
            };
        } else {
            matrixVisited = Array.from({ length: rows }, () =>
                Array.from({ length: cols }, () => false)
            );
            matrixVisited[currentNode[0]][currentNode[1]] = true;
        }
    }
    const neighbors = getNeighbors(currentNode, rows, cols);
    for (let i = neighbors.length - 1; i > -1; i--) {
        if (!matrixVisited[neighbors[i][0]][neighbors[i][1]]) {
            const node = new Node(neighbors[i]);
            node.insertFather(new Node(currentNode));
            nodes.push(node);
            const roat = DFS(environment, neighbors[i], matrixVisited, goals, countTotalGoals, rows, cols, nodes)
            if (roat) {
                return roat;
            }
        }
    }
    return false;
}
