class Node {
    constructor(node) {
        this.node = node;
    }

    insertFather(father) {
        this.father = father
    }
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

/**
 * Retorna el numero de metas que hay en el entorno
 * @param {*} environment 
 * @returns 
 */
function getTotalCountGoals(environment,isPositionsGoals = false) {
    let count = 0;
    let positions = [];
    for (let i = 0; i < environment.length; i++) {
        for (let j = 0; j < environment.length; j++) {
            if (environment[i][j] == 6) {
                count++;
                positions.push([i,j]);
            }
        }
    }
    return isPositionsGoals ? positions : count;
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