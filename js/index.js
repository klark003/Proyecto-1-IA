let environment = [],
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
    environment = [];
    content.forEach(el => {
        let array = [];
        el.split(" ").forEach(item => {
            array.push(parseInt(item));
        })
        environment.push(array);
    });
    document.getElementById("matrix").innerHTML = "";
    for (let i = 0; i < 10; i++) {
        html += "<tr>";
        for (let j = 0; j < 10; j++) {
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



//Eventos
document.getElementById('file-input').addEventListener('change', readFile, false);
document.getElementById("btn1").addEventListener("click", search, false);

function search() {
    const tipoAlgoritmo = document.getElementById("tipoAlgoritmo-select");
    if (tipoAlgoritmo.value != "") {
        switch (tipoAlgoritmo.value) {
            case "Avaro":
                searchAvara();
                break;
            case "A*":
                searchAStart();
                break;
            case "Amplitud":
                searchBFS();
                break;
            case "Costos":
                searchUniformCost();
                break;
            case "Profundiad":
                searchDFS();
                break;
            default:
                break;
        }
    } else {
        alert("Deve seleccionar un algoritmo");
    }
}

