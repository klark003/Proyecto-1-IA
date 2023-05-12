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
                    html += `<td id="cell${i}-${j}"><img src="img/${environment[i][j]}.webp" width="50px" height="50px"></td>`
                } else {
                    html += `<td id="cell${i}-${j}" style="background-color: ${environment[i][j] == 1 ? "black" : "white"};"></td>`
                }
            }
            html += "</tr>";
        }
        document.getElementById("matrix").innerHTML = html;
    }

    /**
     * Inicio busqueda con profundidad
     */

    function searchDFS() {
        const startPos = getStartPoint(environment);
        if (startPos) {
            const roads = [];
            console.time('Execution Time');
            console.time('road time');

            // Buscar el primer nodo meta
            let road1 = DFS(environment, startPos);
            if (road1) {
                roads.push(road1.camino);
            }

            // Buscar el segundo nodo meta
            let road2 = DFS(environment, startPos);
            if (road2) {
                roads.push(road2.camino);
            }

            console.timeEnd('road time');
            console.log(`Nodos expandidos: ${(road1 ? road1.currentNode : 0) + (road2 ? road2.currentNode : 0)}`);
            console.log(`Profundidad del árbol: ${Math.max(road1 ? road1.depth : 0, road2 ? road2.depth : 0)}`);
            console.timeEnd('Execution Time');
            console.log(roads);
        } else {
            alert("No se encontro el punto de partida");
        }
    }

    /**
     * Inicio busqueda con amplitud
     */
    function searchBFS() {
        const startPos = getStartPoint(environment);
        if (startPos) {
            const roads = [];
            console.time('Execution Time');
            console.time('road time');
            let road = BFS(environment, startPos);
            roads.push(road.camino);
            console.timeEnd('road time');
            console.log(road);
            while (road) {
                console.time('road time');
                road = BFS(environment, road.currentNode);
                roads.push(road.camino);
                console.timeEnd('road time');
                console.log(road);
            }
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
        let arrayFathers = [];
        while (tail.length > 0) {
            const expandedNodes = [];
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
                        nodos: arrayFathers
                    };
                }
            }

            for (let i = 0; i < tail.length; i++) {
                const currentNode = tail[i];
                if (environment[currentNode[0]][currentNode[1]] !== 1) {
                    fathers[`${currentNode[0]},${currentNode[1]}`] = [];
                    if (currentNode[0] > 0 && !visited.has(`${currentNode[0] - 1},${currentNode[1]}`)) {//izquierda
                        expandedNodes.push([currentNode[0] - 1, currentNode[1]])
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0] - 1},${currentNode[1]}`);
                        ++countExpandedNodes;
                    }
                    if (currentNode[0] < 9 && !visited.has(`${currentNode[0] + 1},${currentNode[1]}`)) {//derecha
                        expandedNodes.push([currentNode[0] + 1, currentNode[1]])
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0] + 1},${currentNode[1]}`);
                        ++countExpandedNodes;
                    }
                    if (currentNode[1] > 0 && !visited.has(`${currentNode[0]},${currentNode[1] - 1}`)) {//arriba
                        expandedNodes.push([currentNode[0], currentNode[1] - 1])
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0]},${currentNode[1] - 1}`);
                        ++countExpandedNodes;
                    }
                    if (currentNode[1] < 9 && !visited.has(`${currentNode[0]},${currentNode[1] + 1}`)) {//abajo
                        expandedNodes.push([currentNode[0], currentNode[1] + 1])
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0]},${currentNode[1] + 1}`);
                        ++countExpandedNodes;
                    }
                    if (fathers[`${currentNode[0]},${currentNode[1]}`].length > 0) {
                        arrayFathers.push({ father: `${currentNode[0]},${currentNode[1]}`, songs: fathers[`${currentNode[0]},${currentNode[1]}`] })
                    }
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
     * Busqueda con profundidad
     **/

    function DFS(environment, startNode) {
        let path = [];
        const visited = new Set();
        const stack = [[startNode, 0]];
        const fathers = {};
        let maxDepth = 0;
        let goalsFound = 0;
        let goals = [];
        let result = {}; // Objeto devuelto por la función
        let countExpandedNodes = 0;
        while (stack.length > 0) {
            const [currentNode, depth] = stack.pop();
            if (depth > maxDepth) {
                maxDepth = depth;
            }
            if (!visited.has(`${currentNode[0]},${currentNode[1]}`)) {
                visited.add(`${currentNode[0]},${currentNode[1]}`);
                path.push(currentNode);
                if (environment[currentNode[0]][currentNode[1]] === 6) {
                    environment[currentNode[0]][currentNode[1]] = 0;
                    goalsFound++;
                    goals.push(currentNode);
                    if (goalsFound === 2) {
                        const road = [currentNode];
                        let father = getFather(currentNode, fathers);
                        while (father !== undefined) {
                            road.unshift(father);
                            father = getFather(father, fathers);
                        }
                        result = {
                            camino: road,
                            nodosExpandidos: countExpandedNodes,
                            currentNode: currentNode,
                            nodos: fathers,
                            depth: depth,
                            maxDepth: maxDepth,
                            goals: goals
                        };
                        break; // Salir del ciclo while si se encontraron ambos nodos meta
                    }
                }
                if (environment[currentNode[0]][currentNode[1]] !== 1) {
                    fathers[`${currentNode[0]},${currentNode[1]}`] = [];
                    if (currentNode[0] > 0 && environment[currentNode[0] - 1][currentNode[1]] !== 1) {
                        stack.push([[currentNode[0] - 1, currentNode[1]], depth + 1]);
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0] - 1},${currentNode[1]}`);
                        countExpandedNodes++;
                    }
                    if (currentNode[0] < 9 && environment[currentNode[0] + 1][currentNode[1]] !== 1) {
                        stack.push([[currentNode[0] + 1, currentNode[1]], depth + 1]);
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0] + 1},${currentNode[1]}`);
                        countExpandedNodes++;
                    }
                    if (currentNode[1] > 0 && environment[currentNode[0]][currentNode[1] - 1] !== 1) {
                        stack.push([[currentNode[0], currentNode[1] - 1], depth + 1]);
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0]},${currentNode[1] - 1}`);
                        countExpandedNodes++;
                    }
                    if (currentNode[1] < 9 && environment[currentNode[0]][currentNode[1] + 1] !== 1) {
                        stack.push([[currentNode[0], currentNode[1] + 1], depth + 1]);
                        fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0]},${currentNode[1] + 1}`);
                        countExpandedNodes++;
                    }
                }
            }
        }
        return result; // Devolver el objeto con la solución
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

    function searchGreedy() {
        const startPos = getStartPoint(environment);
        if (startPos) {
          const roads = [];
          console.time('Execution Time');
          console.time('road time');
          let goals = []; // Initialize the goals array
          let road1 = greedy(environment, startPos, goals); // Pass goals as parameter
          if (road1) {
            roads.push(road1.path);
          }
          let road2 = greedy(environment, startPos, goals); // Pass goals as parameter
          if (road2) {
            roads.push(road2.path);
          }
          console.timeEnd('road time'); 
          console.log(roads);
          console.log(`Profundidad del árbol: ${Math.max(road1 ? road1.depth : 0, road2 ? road2.depth : 0)}`);
          console.timeEnd('Execution Time');
          console.log(roads);
          console.log(goals);
        } else {
          console.error("No se encontró el punto de partida");
        }
      }
      
      

    function heuristic(node, goals) {
        // Calcular la distancia Manhattan entre el nodo actual y el nodo objetivo más cercano
        let minDist = Infinity;
        for (let goal of goals) {
            let dist = Math.abs(node[0] - goal[0]) + Math.abs(node[1] - goal[1]);
            if (dist < minDist) {
                minDist = dist;
            }
        }
        return minDist;
    }


    function greedy(environment, startNode, goals) {
        let path = [];
        const visited = new Set();
        const queue = [[startNode, 0]];
        const fathers = {};
        let maxDepth = 0;
        let goalsFound = 0;
        let result = {}; // Objeto devuelto por la función
        let countExpandedNodes = 1;
      
        while (queue.length > 0) {
          queue.sort((a, b) => {
            const aDist = heuristic(a[0], goals);
            const bDist = heuristic(b[0], goals);
            return aDist - bDist;
          });
      
          const [currentNode, depth] = queue.shift();
          if (depth > maxDepth) {
            maxDepth = depth;
          }
      
          if (!visited.has(`${currentNode[0]},${currentNode[1]}`)) {
            visited.add(`${currentNode[0]},${currentNode[1]}`);
            path.push([...currentNode]);
      
            if (environment[currentNode[0]][currentNode[1]] === 6) {
              environment[currentNode[0]][currentNode[1]] = 0;
              goalsFound++;
              goals.push(currentNode);
      
              if (goalsFound === 2) {
                const road = [currentNode];
                let father = getFather(currentNode, fathers);
                while (father !== undefined) {
                  road.unshift(father);
                  father = getFather(father, fathers);
                }

                console.log(fathers);
      
                result = {
                    path: road,
                    nodosExpandidos: countExpandedNodes,
                    currentNode: currentNode,
                    nodos: result.nodos || fathers,
                    depth: depth,
                    maxDepth: maxDepth,
                    goals: goals
                };
                break;
              }
            }
      
            if (environment[currentNode[0]][currentNode[1]] !== 1) {
              fathers[`${currentNode[0]},${currentNode[1]}`] = [];
              let neighbors = [];
              if (currentNode[0] > 0 && environment[currentNode[0] - 1][currentNode[1]] !== 1) {
                neighbors.push([[currentNode[0] - 1, currentNode[1]], depth + 1]);
              }
              if (currentNode[0] < 9 && environment[currentNode[0] + 1][currentNode[1]] !== 1) {
                neighbors.push([[currentNode[0] + 1, currentNode[1]], depth + 1]);
              }
              if (currentNode[1] > 0 && environment[currentNode[0]][currentNode[1] - 1] !== 1) {
                neighbors.push([[currentNode[0], currentNode[1] - 1], depth + 1]);
              }
              if (currentNode[1] < 9 && environment[currentNode[0]][currentNode[1] + 1] !== 1) {
                neighbors.push([[currentNode[0], currentNode[1] + 1], depth + 1]);
              }
              neighbors.sort((a, b) => heuristic(a[0], goals) - heuristic(b[0], goals));
              for (let [neighbor, neighborDepth] of neighbors) {
                queue.push([neighbor, neighborDepth]);
                fathers[`${currentNode[0]},${currentNode[1]}`].push(`${neighbor[0]},${neighbor[1]}`);
            }
        }
    }
}
return result;
}



    //Eventos
    document.getElementById('file-input').addEventListener('change', readFile, false);
    document.getElementById("btn1").addEventListener("click", searchBFS, false);
    document.getElementById("btn2").addEventListener("click", searchDFS, false);
    document.getElementById("btn3").addEventListener("click", searchGreedy, false);


});