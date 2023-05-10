class Node {
    constructor(node) {
        this.node = node;
    }

    insertFather(father) {
        this.father = father
    }
}

/**
 * Retorna el numero de metas que hay en el entorno
 * @param {*} environment 
 * @returns 
 */
function getTotalCountGoals(environment) {
    let count = 0;
    for (let i = 0; i < environment.length; i++) {
        for (let j = 0; j < environment.length; j++) {
            if (environment[i][j] == 6) {
                count++;
            }
        }
    }
    return count;
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