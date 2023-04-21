document.addEventListener("DOMContentLoaded", () => {
    let environment = [
        [0, 5, 3, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 0, 0, 1, 0, 0, 0, 1, 1],
        [0, 1, 1, 0, 3, 5, 1, 0, 2, 0],
        [0, 1, 1, 1, 3, 1, 1, 1, 1, 0],
        [6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 4, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 0, 4, 4, 0, 0, 1, 1, 5],
        [1, 1, 0, 0, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 5, 0, 0, 0],
        [1, 1, 1, 6, 1, 1, 0, 1, 1, 1]],
        matrix = [],
        html = "";

    for (let i = 0; i < 10; i++) {
        matrix.push([]);
        html += "<tr>";
        for (let j = 0; j < 10; j++) {
            matrix[i].push(new Cell(i, j, environment[i][j]));
            if (environment[i][j] > 1) {
                html += `<td><img src="img/${environment[i][j]}.webp" width="50px" height="50px"></td>`
            } else {
                html += `<td style="background-color: ${environment[i][j] == 1 ? "black" : "white"};"></td>`
            }
        }
        html += "</tr>";
    }
    document.getElementById("matrix").innerHTML = html;

    /**
     * Retorna la posición del punto inicial
     * @param {matrix} environment 
     * @returns 
     */
    function getStartPoint(environment) {
        for (let i = 0; i < environment.length; i++) {
            for (let j = 0; j < environment.length; j++) {
                if (environment[i][j] == 2) {
                    return [i, j];
                }
            }
        }
        return false;
    }

    /**
     * Retorna las posiciónes de los puntos a donde se debe llegar
     * @param {matrix} environment 
     * @returns 
     */
    function getEndsPoints(environment) {
        const endsPos = [];
        for (let i = 0; i < environment.length; i++) {
            for (let j = 0; j < environment.length; j++) {
                if (environment[i][j] == 6) {
                    endsPos.push([i, j]);
                }
            }
        }
        return endsPos;
    }



    /**
     * Inicio busqueda con amplitud
     */
    function searchBFS() {
        const startPos = getStartPoint(environment);
        const endsPos = getEndsPoints(environment);
        console.log(endsPos);
        let road = BFS(environment, startPos, endsPos[0]);
        if (startPos && endsPos.length > 0) {
            for (let i = 1; i < endsPos.length; i++) {
                const road1 = BFS(environment, endsPos[-i], endsPos[i]);
                road.concat(road1);
            }
            console.log(road);
        } else {
            console.log("Falta el punto de partida o los puntos de llegada");
        }
    }

    /**
     * Busqueda con amplitud
     * @param {*} environment 
     * @param {*} startNode 
     * @param {*} endNode 
     * @returns 
     */
    function BFS(environment, startNode, endNode) {
        let tail = [startNode];
        const visited = new Set();
        const fathers = {}

        while (tail.length > 0) {
            const expandedNodes = [];
            for (let i = 0; i < tail.length; i++) {
                const currentNode = tail[i];
                visited.add(`${currentNode[0]},${currentNode[1]}`);
                if (environment[currentNode[0]][currentNode[1]] === environment[endNode[0]][endNode[1]]) {
                    const road = [endNode];
                    let father = getFather(endNode, fathers);
                    while (father !== undefined) {
                        road.unshift(father);
                        father = getFather(father, fathers);
                    }
                    return road;
                }
                if (environment[currentNode[0]][currentNode[1]] !== 1) {
                    fathers[`${currentNode[0]},${currentNode[1]}`] = [];
                    if (currentNode[0] > 0 && !visited.has(`${currentNode[0] - 1},${currentNode[1]}`)) {
                        visited.add(`${currentNode[0] - 1},${currentNode[1]}`)
                        expandedNodes.push([currentNode[0] - 1, currentNode[1]])
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0] - 1},${currentNode[1]}`);
                    }
                    if (currentNode[0] < 9 && !visited.has(`${currentNode[0] + 1},${currentNode[1]}`)) {
                        visited.add(`${currentNode[0] + 1},${currentNode[1]}`)
                        expandedNodes.push([currentNode[0] + 1, currentNode[1]])
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0] + 1},${currentNode[1]}`);
                    }
                    if (currentNode[1] > 0 && !visited.has(`${currentNode[0]},${currentNode[1] - 1}`)) {
                        visited.add(`${currentNode[0]},${currentNode[1] - 1}`)
                        expandedNodes.push([currentNode[0], currentNode[1] - 1])
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0]},${currentNode[1] - 1}`);
                    }
                    if (currentNode[1] < 9 && !visited.has(`${currentNode[0]},${currentNode[1] + 1}`)) {
                        visited.add(`${currentNode[0]},${currentNode[1] + 1}`)
                        expandedNodes.push([currentNode[0], currentNode[1] + 1])
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0]},${currentNode[1] + 1}`);
                    }
                }
            }
            tail = expandedNodes;
        }
    }

    /**
     * Obtiene el padre
     * @param {*} node 
     * @param {*} fathers 
     * @returns 
     */
    function getFather(node, fathers) {
        if (node[0] > 0 && fathers[`${node[0] - 1},${node[1]}`]) {
            for (let i = 0; i < fathers[`${node[0] - 1},${node[1]}`].length; i++) {
                if (fathers[`${node[0] - 1},${node[1]}`][i] == `${node[0]},${node[1]}`) {
                    return [node[0] - 1, node[1]];
                }
            }

        }
        if (node[0] < 9 && fathers[`${node[0] + 1},${node[1]}`]) {
            for (let i = 0; i < fathers[`${node[0] + 1},${node[1]}`].length; i++) {
                if (fathers[`${node[0] + 1},${node[1]}`][i] == `${node[0]},${node[1]}`) {
                    return [node[0] + 1, node[1]];
                }
            }
        }
        if (node[1] > 0 && fathers[`${node[0]},${node[1] - 1}`]) {
            for (let i = 0; i < fathers[`${node[0]},${node[1] - 1}`].length; i++) {
                if (fathers[`${node[0]},${node[1] - 1}`][i] == `${node[0]},${node[1]}`) {
                    return [node[0], node[1] - 1];
                }
            }
        }
        if (node[1] < 9 && fathers[`${node[0]},${node[1] + 1}`]) {
            for (let i = 0; i < fathers[`${node[0]},${node[1] + 1}`].length; i++) {
                if (fathers[`${node[0]},${node[1] + 1}`][i] == `${node[0]},${node[1]}`) {
                    return [node[0], node[1] + 1];
                }
            }
        }
        return undefined;
    }

});