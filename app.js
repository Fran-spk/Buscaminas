const Filas = 10;
const Columnas = 10;
const MinasTotales = 10;
let Tablero = [];


const TableroDOM = document.getElementById("Tablero");



function IniciarJuego() {
  TableroDOM.innerHTML = "";
  Tablero = [];
  MinasRestantes = MinasTotales;
  TableroDOM.style.gridTemplateColumns = `repeat(${Columnas}, 40px)`;
   for (let i = 0; i < Filas * Columnas; i++) {
    Tablero.push({
      Minado: false,
      Revelado: false,
      Bandera: false,
    });
  }

  for (let i = 0; i < Filas * Columnas; i++) {
    const Celda = document.createElement("div");
    Celda.classList.add("Celda");
    Celda.dataset.index = i; 
    Celda.addEventListener("click", () => Revelar(i));
    TableroDOM.appendChild(Celda);
  }

  GenerarMinas()
}

function GenerarMinas() {
  let Colocadas = 0;
  while (Colocadas < MinasTotales) {
    let i = Math.floor(Math.random() * Tablero.length);
    if (!Tablero[i].Minado) {
      Tablero[i].Minado = true;
      Colocadas++;
    }
  }
}

function Revelar(i) {
  const Celda = Tablero[i];
  const CeldaDom = TableroDOM.children[i];

  if (Celda.Revelado || Celda.Bandera) return;

  Celda.Revelado = true;
  CeldaDom.classList.add("Revelada");

  if (Celda.Minado) {
    CeldaDom.classList.add("Minado");
    CeldaDom.textContent = "💣";
    alert("💥 ¡Perdiste! 💥");
    return;
  }
}

document.addEventListener("DOMContentLoaded", IniciarJuego);