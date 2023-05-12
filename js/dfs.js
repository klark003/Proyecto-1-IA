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


public static List<Nodo> busquedaPorProfundidad(int[][] matriz) {

    int n = matriz.length;
    int m = matriz[0].length;
    boolean[][] visitado = new boolean[n][m];
    Stack<Nodo> pila = new Stack<>();
    List<Nodo> nodosExpandidos = new ArrayList<>();
    List<Nodo> path = new ArrayList<>();
    int nEsferas = 0;
    Nodo nodoInicial = new Nodo(2, 8, 0, null);
    pila.push(nodoInicial);
    nodosExpandidos.add(nodoInicial);
    visitado[0][0] = true;

    while (!pila.empty()) {
        Nodo nodoActual = pila.pop();

        if (matriz[nodoActual.x][nodoActual.y] == 6) {

            nEsferas++;
            pila.clear();
            pila.push(nodoActual);

            System.out.println("Goku encontró la Esfera del Dragón en la posición (" + nodoActual.x + ", " + nodoActual.y + ")");

            System.out.println("Nodos expandidos: " + nodosExpandidos.size());
            for (Nodo nodosExpandido : nodosExpandidos) {
                System.out.print("[" + nodosExpandido.x + "," + nodosExpandido.y + "]");
            }
            System.out.println("");
            System.out.println("Profundidad del árbol: " + nodoActual.level);

            for (int i = 0; i < n; i++) {
                for (int j = 0; j < m; j++) {
                    if (visitado[i][j] == true) {
                        System.out.print("0 ");
                    } else {
                        System.out.print("1 ");
                    }
                }
                System.out.println();
            }
            System.out.println("");
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < m; j++) {
                    visitado[i][j] = false;
                }
            }

            visitado[nodoActual.x][nodoActual.y] = true;
            matriz[nodoActual.x][nodoActual.y] = 0;
            Nodo nodoCamino = nodoActual;

            while (nodoCamino != null) {
                path.add(nodoCamino);
                nodoCamino = nodoCamino.parent;
            }

            Collections.reverse(path);
            System.out.print("Camino: ");

            for (int i = 0; i < path.size(); i++) {
                System.out.print("[" + path.get(i).x + "," + path.get(i).y + "]");
            }
            System.out.println("");
            //cola.add(new Nodo(nodoActual.x, nodoActual.y, nodoActual.level));
            if (nEsferas == 2) {
                System.out.println("Goku ha encontrado las 2 esferas del Dragón");

                return path;
            }
            path.clear();
        }
        // Agrega los nodos hijos a la pila
        if (nodoActual.x > 0 && !visitado[nodoActual.x - 1][nodoActual.y] && matriz[nodoActual.x - 1][nodoActual.y] != 1) {
            visitado[nodoActual.x - 1][nodoActual.y] = true;
            Nodo hijo = new Nodo(nodoActual.x - 1, nodoActual.y, nodoActual.level + 1, nodoActual);
            pila.push(hijo);
            nodosExpandidos.add(hijo);
        }
        if (nodoActual.x < n - 1 && !visitado[nodoActual.x + 1][nodoActual.y] && matriz[nodoActual.x + 1][nodoActual.y] != 1) {
            visitado[nodoActual.x + 1][nodoActual.y] = true;
            Nodo hijo = new Nodo(nodoActual.x + 1, nodoActual.y, nodoActual.level + 1, nodoActual);
            pila.push(hijo);
            nodosExpandidos.add(hijo);
        }
        if (nodoActual.y > 0 && !visitado[nodoActual.x][nodoActual.y - 1] && matriz[nodoActual.x][nodoActual.y - 1] != 1) {
            visitado[nodoActual.x][nodoActual.y - 1] = true;
            Nodo hijo = new Nodo(nodoActual.x, nodoActual.y - 1, nodoActual.level + 1, nodoActual);
            pila.push(hijo);
            nodosExpandidos.add(hijo);
        }
        if (nodoActual.y < m - 1 && !visitado[nodoActual.x][nodoActual.y + 1] && matriz[nodoActual.x][nodoActual.y + 1] != 1) {
            visitado[nodoActual.x][nodoActual.y + 1] = true;
            Nodo hijo = new Nodo(nodoActual.x, nodoActual.y + 1, nodoActual.level + 1, nodoActual);
            pila.push(hijo);
            nodosExpandidos.add(hijo);
        }
    }

    System.out.println("Goku no pudo encontró Esferas del Dragón");
    System.out.println("Número de nodos expandidos: " + nodosExpandidos.size());
    System.out.println("Profundidad del árbol: " + nodosExpandidos.get(nodosExpandidos.size() - 1).level);
    return path;
}
