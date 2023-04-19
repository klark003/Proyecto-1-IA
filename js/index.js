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
            if(environment[i][j] > 1){
                html += `<td><img src="img/${environment[i][j]}.webp" width="50px" height="50px"></td>`
            }else{
                html += `<td style="background-color: ${environment[i][j] == 1 ? "black" : "white"};"></td>`
            }
        }
        html += "</tr>";
    }
    document.getElementById("matrix").innerHTML = html;

});