const nodes = [];

function uniformCostSearch(matrix, start) {
    // Obtenemos el tamaño de la matriz
    const rows = matrix.length;
    const cols = matrix[0].length;



    // Creamos una cola de prioridad para guardar los nodos a explorar
    let priorityQueue = new PriorityQueue();

    // Agregamos el nodo inicial con un costo de 0 a la cola de prioridad
    priorityQueue.enqueue([start, 0, 0, []]);

    // Creamos una matriz para guardar los costos acumulados
    let costMatrix = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Infinity)
    );

    const totalCountGoals = getTotalCountGoals(matrix);
    let countGoals = 0;

    // El costo acumulado para el nodo inicial es 0
    costMatrix[start[0]][start[1]] = 0;
    // Mientras haya nodos por explorar en la cola de prioridad
    while (!priorityQueue.isEmpty()) {
        // Sacamos el nodo con el menor costo de la cola de prioridad
        const [currentNode, currentCost, currentSeeds, currentPositionsRecolectedSeeds] = priorityQueue.dequeue();

        // Si el nodo actual ya fue explorado con un costo menor, lo ignoramos
        if (currentCost > costMatrix[currentNode[0]][currentNode[1]]) {
            continue;
        }

        //si el nodo actual es un muro, lo ignoramos
        if (matrix[currentNode[0]][currentNode[1]] == 1) {
            continue;
        }

        // Si el nodo actual es el objetivo, retornamos el costo acumulado
        if (matrix[currentNode[0]][currentNode[1]] == 6) {
            countGoals++;
            matrix[currentNode[0]][currentNode[1]] = 0;
            if (countGoals == totalCountGoals) {
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
                    cost: currentCost
                };
            } else {
                priorityQueue = new PriorityQueue();
                costMatrix = Array.from({ length: rows }, () =>
                    Array.from({ length: cols }, () => Infinity)
                );
                costMatrix[currentNode[0]][currentNode[1]] = currentCost;
            }

        }

        // Actualizamos los costos de los vecinos del nodo actual
        for (const [i, j] of getNeighbors(currentNode, rows, cols)) {
            let neighborPositionsRecolectedSeeds = [];
            let totalSeeds = 0;
            let neighborCost = 1;
            if (matrix[i][j] == 3) {// si hay un freezer
                if (currentSeeds > 0) {// si tengo semilla
                    totalSeeds = currentSeeds - 1;
                } else {// si no tengo
                    neighborCost = 4;
                }
            } else if (matrix[i][j] == 4) {// si hay un cell
                if (currentSeeds > 0) {// si tengo semilla
                    totalSeeds = currentSeeds - 1;
                } else {// si no tengo
                    neighborCost = 7;
                }
            } else if (matrix[i][j] == 5 && isNotRecolectedSeed(i, j, currentPositionsRecolectedSeeds)) {
                neighborPositionsRecolectedSeeds.push([i, j]);
                totalSeeds = currentSeeds + 1;
            }

            const totalCost = currentCost + neighborCost;
            const totalPositionsRecolectedSeeds = currentPositionsRecolectedSeeds.concat(neighborPositionsRecolectedSeeds);
            if (totalCost < costMatrix[i][j]) {
                costMatrix[i][j] = totalCost;
                priorityQueue.enqueue([[i, j], totalCost, totalSeeds, totalPositionsRecolectedSeeds]);
                const node = new Node([[i, j], totalCost]);
                node.insertFather(new Node([currentNode, currentCost]));
                nodes.push(node);
            }
        }
    }

    // Si no encontramos el objetivo, retornamos null
    return null;
}

/**
 * Verifica si ya recolecto una semilla para una casilla
 * @param {*} i 
 * @param {*} j 
 * @param {*} currentPositionsRecolectedSeeds 
 */
function isNotRecolectedSeed(i, j, positionsRecolectedSeeds) {
    for (let index = 0; index < positionsRecolectedSeeds.length; index++) {
        const pos = positionsRecolectedSeeds[index];
        if (pos[0] == i && pos[1] == j) {
            return false;
        }
    }
    return true;
}

// Función para obtener los vecinos de una celda en la matriz
function getNeighbors(node, rows, cols) {
    const [i, j] = node;
    const neighbors = [];
    if (i > 0) {
        neighbors.push([i - 1, j]);
    }
    if (i < rows - 1) {
        neighbors.push([i + 1, j]);
    }
    if (j > 0) {
        neighbors.push([i, j - 1]);
    }
    if (j < cols - 1) {
        neighbors.push([i, j + 1]);
    }
    return neighbors;
}

// Clase para implementar una cola de prioridad
class PriorityQueue {
    constructor() {
        this.items = [];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    enqueue(item) {
        let added = false;
        for (let i = 0; i < this.items.length; i++) {
            if (item[1] < this.items[i][1]) {
                this.items.splice(i, 0, item);
                added = true;
                break;
            }
        }
        if (!added) {
            this.items.push(item);
        }
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }
}

let matrix = [
    [0, 5, 3, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 0, 0, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 3, 5, 1, 0, 2, 0],
    [0, 1, 1, 1, 3, 1, 1, 1, 1, 0],
    [6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 4, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 4, 4, 0, 0, 1, 1, 5],
    [1, 1, 0, 0, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 5, 0, 0, 0],
    [1, 1, 1, 6, 1, 1, 0, 1, 1, 1]
]
const start = [2, 8];
const cost = uniformCostSearch(matrix, start);
console.log(cost); // Output: 15




