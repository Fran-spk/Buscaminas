
const Filas = 10;
const Columnas = 10;
const MinasTotales = 10;
let Tablero = [];
let segundos = 0;


const TableroDOM = document.getElementById("Tablero");
const ResultadoDOM = document.querySelector(".Resultado");


function IniciarJuego() {
  iniciarTimer();
  TableroDOM.innerHTML = "";
  Tablero = [];
  MinasRestantes = MinasTotales;
  TableroDOM.style.gridTemplateColumns = `repeat(${Columnas}, 48px)`;
  //inicializo el tablero logico
   for (let i = 0; i < Filas * Columnas; i++) {
    Tablero.push({
      Minado: false,
      Revelado: false,
      Bandera: false,
      MinasCerca: 0,
    });
  }
  //crear las celdas y sus eventos
  for (let i = 0; i < Filas * Columnas; i++) {
    const Celda = document.createElement("div");
    Celda.classList.add("Celda");
    Celda.dataset.index = i; 
    Celda.addEventListener("click", () => Revelar(i));
     Celda.addEventListener("contextmenu", (e) => {
      e.preventDefault(); 
      PonerBandera(i);
    });
    TableroDOM.appendChild(Celda);
  }
  GenerarMinas()
  ObtenerMinasCerca()
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


function ObtenerMinasCerca(){
   for (let i = 0; i < Tablero.length; i++) {
    if (Tablero[i].Minado) continue;
    let Vecinos = ObtenerVecinos(i);
    Tablero[i].MinasCerca = Vecinos.filter((v) => Tablero[v].Minado).length;
  }
}

function ObtenerVecinos(celda) {
  const fila = Math.floor(celda / Columnas);
  const col = celda % Columnas;
  const vecinos = [];

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const F = fila + i;
      const C = col + j;
      if (F >= 0 && F < Filas && C >= 0 && C < Columnas) {
        vecinos.push(F * Columnas + C);
      }
    }
  }
  return vecinos;
}

function Revelar(i) {
  const Celda = Tablero[i];
  const CeldaDom = TableroDOM.children[i];

  if (Celda.Revelado || Celda.Bandera) return;

  Celda.Revelado = true;
  CeldaDom.classList.add("Revelada");

 if (Celda.Minado) {
  Perder(CeldaDom)
  return;
  }
 // si no hay minas cercas llamar la funcion revelar de cada casilla libre vecina para verificar nuevamente minas cercanas, asi recursivamente hasta q halla
  if (Celda.MinasCerca > 0) {
    CeldaDom.textContent = Celda.MinasCerca;
  } else {
    ObtenerVecinos(i).forEach((v) => Revelar(v));
  }
   VerificarVictoria()
}

function PonerBandera(i) {
  const Celda = Tablero[i];
  const CeldaDom = TableroDOM.children[i];

  if (Celda.Revelado) return; 

  Celda.Bandera = !Celda.Bandera;
  if (Celda.Bandera) {
    CeldaDom.classList.add("Bandera");
  } else {
    CeldaDom.textContent = "";
    CeldaDom.classList.remove("Bandera");
  }
   VerificarVictoria()
}

document.addEventListener("DOMContentLoaded", IniciarJuego);

function RevelarCeldas() {
 for (let i = 0; i < Tablero.length; i++) {
   const celda = Tablero[i];
   const celdaDOM = TableroDOM.children[i];

   celdaDOM.classList.add("Revelada");

   if (celda.Minado) {
    celdaDOM.classList.add("Minado");
    continue;
    }

    if (celda.MinasCerca > 0) {
    celdaDOM.textContent = celda.MinasCerca;
    } 
  }
}

function VerificarVictoria() {
  const reveladas = Tablero.filter((c) => c.Revelado ).length;
  const noMinas = Tablero.filter((c) => !c.Minado ).length;
  //si lo unico no revelado son las minas 
  if (reveladas=== noMinas) {
     ResultadoDOM.textContent = 'GANASTE';
     ResultadoDOM.classList.add("ganar");
     RevelarCeldas();
  }
}

function Perder(celda)
{
  celda.classList.add("Minado");
  RevelarCeldas();
  ResultadoDOM.textContent = 'PERDISTE';
  ResultadoDOM.classList.add("perder");
  reiniciarTimer();
}


function iniciarTimer() {
  setInterval(() => {
    segundos++;
    const timerDom = document.getElementById("Timer");
    if (timerDom) {
      timerDom.textContent = `Tiempo: ${segundos}s`;
    }
  }, 1000);
}

function reiniciarTimer() {
  segundos = 0;
  document.getElementById("Timer").textContent = "Tiempo: 0s";
}
