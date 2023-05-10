document.addEventListener("DOMContentLoaded", () => {

    let environment = [],
        matrix = [],
        html = "";

    /**
     * Carga el archivo 
     * @param {Event} e 
     * @returns 
     */
    function readFile(e) {
        environment = [];
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            loadEnvironment(e.target.result.split("\r\n"));
        };
        reader.readAsText(file);
    }

    /**
     * Carga el entorno en la vista
     * @param {Array} content 
     */
    function loadEnvironment(content) {
        content.forEach(el => {
            let array = [];
            el.split(" ").forEach(item => {
                array.push(parseInt(item));
            })
            environment.push(array);
        });

        for (let i = 0; i < 10; i++) {
            matrix.push([]);
            html += "<tr>";
            for (let j = 0; j < 10; j++) {
                matrix[i].push(new Cell(i, j, environment[i][j]));
                if (environment[i][j] > 1) {
                    html += `<td id="cell${i}-${j}"><img src="assets/img/${environment[i][j]}.webp" width="50px" height="50px"></td>`
                } else {
                    html += `<td id="cell${i}-${j}" style="background-color: ${environment[i][j] == 1 ? "black" : "white"};"></td>`
                }
            }
            html += "</tr>";
        }
        document.getElementById("matrix").innerHTML = html;
    }

    /**
     * Inicio busqueda con amplitud
     */
    function searchBFS() {
        const startPos = getStartPoint(environment);
        if (startPos) {
            const results = [];
            console.time('Execution Time');
            console.time('road time');
            let result = BFS(environment, startPos);
            results.push(result.camino);
            console.timeEnd('road time');
            console.log(result);
            while (result) {
                console.time('road time');
                result = BFS(environment, result.currentNode);
                results.push(result.camino);
                console.timeEnd('road time');
                console.log(result);
            }
            console.timeEnd('Execution Time');
            console.log(results)
            
        } else {
            alert("No se encontro el punto de partida");
        }
    }
    
    /**
     * Inicio busqueda por profundidad
     */
    
    function searchDFS() {
        const startPos = getStartPoint(environment);
        if (startPos) {
          const roads = [];
          console.time('Execution Time');
          console.time('road time');
      
          // Buscar el primer nodo meta
          let road1 = DFS(environment, startPos);
          roads.push(road1.camino);
      
          // Buscar el segundo nodo meta
          let road2 = DFS(environment, startPos);
          roads.push(road2.camino);
      
          console.timeEnd('road time');
          console.log(road1);
          console.log(road2);
      
          console.timeEnd('Execution Time');
          console.log(roads)
        } else {
          alert("No se encontro el punto de partida");
        }
      }

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
     * Busqueda con amplitud
     * @param {*} environment 
     * @param {*} startNode 
     * @returns 
     */
    function BFS(environment, startNode) {
        let tail = [startNode];
        const visited = new Set();
        let depth = 1;
        let countExpandedNodes = 1;
        const fathers = {}
        while (tail.length > 0) {
            const expandedNodes = [];
            let newTail = [];
            for (let i = 0; i < tail.length; i++) {
                const currentNode = tail[i];
                visited.add(`${currentNode[0]},${currentNode[1]}`);
                if (environment[currentNode[0]][currentNode[1]] === 6) {
                    environment[currentNode[0]][currentNode[1]] = 0;
                    const road = [currentNode];
                    let father = getFather(currentNode, fathers);
                    while (father !== undefined) {
                        road.unshift(father);
                        father = getFather(father, fathers);
                    }
                    return {
                        camino: road,
                        profundidad: depth,
                        nodosExpandidos: countExpandedNodes,
                        currentNode: currentNode,
                    };
                }else if(environment[currentNode[0]][currentNode[1]] !== 1){
                    newTail.push(currentNode);
                }
            }
            tail = newTail;
            for (let i = 0; i < tail.length; i++) {
                const currentNode = tail[i];
                fathers[`${currentNode[0]},${currentNode[1]}`] = [];
                if (currentNode[0] > 0 && !visited.has(`${currentNode[0] - 1},${currentNode[1]}`)) {//izquierda
                    expandedNodes.push([currentNode[0] - 1, currentNode[1]])
                    fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0] - 1},${currentNode[1]}`);
                    countExpandedNodes++;
                }
                if (currentNode[0] < 9 && !visited.has(`${currentNode[0] + 1},${currentNode[1]}`)) {//derecha
                    expandedNodes.push([currentNode[0] + 1, currentNode[1]])
                    fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0] + 1},${currentNode[1]}`);
                    countExpandedNodes++;
                }
                if (currentNode[1] > 0 && !visited.has(`${currentNode[0]},${currentNode[1] - 1}`)) {//arriba
                    expandedNodes.push([currentNode[0], currentNode[1] - 1])
                    fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0]},${currentNode[1] - 1}`);
                    countExpandedNodes++;
                }
                if (currentNode[1] < 9 && !visited.has(`${currentNode[0]},${currentNode[1] + 1}`)) {//abajo
                    expandedNodes.push([currentNode[0], currentNode[1] + 1])
                    fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0]},${currentNode[1] + 1}`);
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

    //Eventos
    document.getElementById('file-input').addEventListener('change', readFile, false);
    document.getElementById("btn1").addEventListener("click", searchBFS, false);

});
