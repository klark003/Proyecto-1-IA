function searchBFS() {
    const startPos = getStartPoint(environment);
    if (startPos) {
        console.log("Busqueda por Amplitud");
        let t1 = performance.now();
        const result = BFS(environment, startPos);
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

function BFS(environment, startNode) {
    const nodes = [];
    let tail = [startNode];
    const visited = new Set();
    let depth = 0;
    const totalCountGoals = getTotalCountGoals(environment);
    let countGoals = 0;
    let countExpandedNodes = 1;
    while (tail.length > 0) {
        const expandedNodes = [];
        let newTail = [];
        for (let i = 0; i < tail.length; i++) {
            const currentNode = tail[i];
            visited.add(`${currentNode[0]},${currentNode[1]}`);
            if (environment[currentNode[0]][currentNode[1]] === 6) {
                countGoals++;
                environment[currentNode[0]][currentNode[1]] = 0;
                if (countGoals == totalCountGoals) {
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
                        profundidad: depth,
                        totalNodosExpandidos: countExpandedNodes,
                    };
                } else {
                    visited.clear();
                    visited.add(`${currentNode[0]},${currentNode[1]}`);
                    newTail = [currentNode];
                    break;
                }
            } else if (environment[currentNode[0]][currentNode[1]] !== 1) {
                newTail.push(currentNode);
            }
        }
        tail = newTail;
        for (let i = 0; i < tail.length; i++) {
            const currentNode = tail[i];
            if (currentNode[0] > 0 && !visited.has(`${currentNode[0] - 1},${currentNode[1]}`)) {//izquierda
                const node = new Node([currentNode[0] - 1, currentNode[1]]);
                node.insertFather(new Node(currentNode));
                nodes.push(node);
                expandedNodes.push([currentNode[0] - 1, currentNode[1]])
                countExpandedNodes++;
            }
            if (currentNode[0] < 9 && !visited.has(`${currentNode[0] + 1},${currentNode[1]}`)) {//derecha
                const node = new Node([currentNode[0] + 1, currentNode[1]]);
                node.insertFather(new Node(currentNode));
                nodes.push(node);
                expandedNodes.push([currentNode[0] + 1, currentNode[1]])
                countExpandedNodes++;
            }
            if (currentNode[1] > 0 && !visited.has(`${currentNode[0]},${currentNode[1] - 1}`)) {//arriba
                const node = new Node([currentNode[0], currentNode[1] - 1]);
                node.insertFather(new Node(currentNode));
                nodes.push(node);
                expandedNodes.push([currentNode[0], currentNode[1] - 1])
                countExpandedNodes++;
            }
            if (currentNode[1] < 9 && !visited.has(`${currentNode[0]},${currentNode[1] + 1}`)) {//abajo
                const node = new Node([currentNode[0], currentNode[1] + 1]);
                node.insertFather(new Node(currentNode));
                nodes.push(node);
                expandedNodes.push([currentNode[0], currentNode[1] + 1])
                countExpandedNodes++;
            }
        }
        if (expandedNodes.length > 0) {
            depth++;
        }
        tail = expandedNodes;
    }
    return false;
}