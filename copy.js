const nodes = [];

function uniformCostSearch(matrix, start) {
    // Obtenemos el tamaño de la matriz
    const rows = matrix.length;
    const cols = matrix[0].length;

    let seed = 0;

    // Creamos una cola de prioridad para guardar los nodos a explorar
    const priorityQueue = new PriorityQueue();

    // Agregamos el nodo inicial con un costo de 0 a la cola de prioridad
    priorityQueue.enqueue([start, 0]);

    // Creamos una matriz para guardar los costos acumulados
    const costMatrix = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Infinity)
    );

    // El costo acumulado para el nodo inicial es 0
    costMatrix[start[0]][start[1]] = 0;
    const fathers = {};
    // Mientras haya nodos por explorar en la cola de prioridad
    while (!priorityQueue.isEmpty()) {
        // Sacamos el nodo con el menor costo de la cola de prioridad
        const [currentNode, currentCost] = priorityQueue.dequeue();

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
            let current = undefined;
            const roat = []
            for (let i = nodes.length - 1; i > -1; i--) {
                const node = nodes[i].node;
                if (node[0][0] == currentNode[0] && node[0][1] == currentNode[1]) {
                    current = nodes[i];
                    roat.push(current.node);
                    break;
                }
            }
            for (let i = nodes.length - 1; i > -1; i--) {
                const father = nodes[i].node;
                const node = current.father.node;
                if (father[1] == node[1] && father[0][0] == node[0][0] && father[0][1] == node[0][1]) {
                    current = nodes[i];
                    roat.unshift(current.node);
                }
            }
            roat.unshift(current.father.node)
            return {
                roat: roat,
                depth: roat.length - 1,
                nodes: nodes,
                cost: currentCost
            };
        }

        // Actualizamos los costos de los vecinos del nodo actual

        for (const [i, j] of getNeighbors(currentNode, rows, cols)) {
            let neighborCost = 1;
            if (matrix[i][j] == 3) {// se hay un freezer
                if (seed > 0) {// si tengo semilla
                    seed--;
                } else {// si no tengo
                    console.log("freezer")
                    neighborCost = 4;
                }
            } else if (matrix[i][j] == 4) {// se hay un cell
                if (seed > 0) {// si tengo semilla
                    seed--;
                } else {// si no tengo
                    neighborCost = 7;
                }
            }else if(matrix[i][j] == 5){
                console.log("seed")
                seed++;
            }
            const totalCost = currentCost + neighborCost;

            if (totalCost < costMatrix[i][j]) {
                costMatrix[i][j] = totalCost;
                priorityQueue.enqueue([[i, j], totalCost]);
                const node = new Node([[i, j], totalCost]);
                node.insertFather(new Node([currentNode, currentCost]));
                nodes.push(node);
            }
        }
    }

    // Si no encontramos el objetivo, retornamos null
    return null;
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

class Node {
    constructor(node) {
        this.node = node;
    }

    insertFather(father) {
        this.father = father
    }
}

// Ejemplo de uso
let matrix = [
    [2, 3, 4],
    [1, 5, 6],
    [9, 8, 7],
];
matrix = [
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
