document.addEventListener("DOMContentLoaded", () => {
    const nodes = [];
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
            console.time('road time');
            const result = BFS(environment, startPos);
            console.timeEnd('road time');
            console.log(result)
            showSolution(result.camino,0);
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
     * Busqueda con amplitud
     * @param {*} environment 
     * @param {*} startNode 
     * @returns 
     */
    function BFS(environment, startNode) {
        let tail = [startNode];
        const visited = new Set();
        let depth = 1;
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
                            nodosExpandidos: countExpandedNodes,
                            fathers: nodes
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
                  nodosExpandidos: visited.size,
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
              }
              if (currentNode[0] < 9 && environment[currentNode[0] + 1][currentNode[1]] !== 1) {
                stack.push([[currentNode[0] + 1, currentNode[1]], depth + 1]);
                fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0] + 1},${currentNode[1]}`);
              }
              if (currentNode[1] > 0 && environment[currentNode[0]][currentNode[1] - 1] !== 1) {
                stack.push([[currentNode[0], currentNode[1] - 1], depth + 1]);
                fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0]},${currentNode[1] - 1}`);
              }
              if (currentNode[1] < 9 && environment[currentNode[0]][currentNode[1] + 1] !== 1) {
                stack.push([[currentNode[0], currentNode[1] + 1], depth + 1]);
                fathers[`${currentNode[0]},${currentNode[1]}`].push(`${currentNode[0]},${currentNode[1] + 1}`);
              }
            }
          }
        }
     
      }
    
    
    
    

    /**
     * Muestra la solución encontrada
     * @param {*} array 
     */
    function showSolution(array,index){
        if(index < array.length){
            const currentCell = document.getElementById(`cell${array[index][0]}-${array[index][1]}`);
            currentCell.innerHTML = `<img src="assets/img/2.webp" width="50px" height="50px">`;
            if(index > 0){
                const previousCell = document.getElementById(`cell${array[index - 1][0]}-${array[index - 1][1]}`);
                previousCell.innerHTML = "";
            }
            setTimeout(() => {
                showSolution(array,index + 1)
            }, 200);
        }
    }

    //Eventos
    document.getElementById('file-input').addEventListener('change', readFile, false);
    document.getElementById("btn1").addEventListener("click", searchBFS, false);

});
