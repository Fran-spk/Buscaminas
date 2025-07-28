const Filas = 10;
const Columnas = 10;
const MinasTotales = 10;
let MinasRestantes = MinasTotales;
let Tablero = [];
let juegoIniciado = false;

const TableroDOM = document.getElementById("Tablero");
const ResultadoDOM = document.querySelector(".Resultado");
const btnNuevaPartida = document.getElementById("NuevaPartida")
const CaraDOM = document.getElementById("Cara");
const BanderasDOM = document.getElementById("Banderas");


function IniciarJuego() {
  // Limpio el DOM y el array Tablero correctamente
  TableroDOM.innerHTML = "";
  Tablero = [];
  TableroDOM.style.gridTemplateColumns = `repeat(${Columnas}, 48px)`;
  juegoIniciado = false; // Reinicio el estado del juego
  reiniciarTimer(); // Aseguro que el timer muestre 0 al iniciar
  MinasRestantes = MinasTotales;
if (BanderasDOM) {
  BanderasDOM.textContent = `🚩: ${MinasRestantes}`;
}

  //inicializo el tablero logico y creo las celdas y sus eventos
  for (let i = 0; i < Filas * Columnas; i++) {
    Tablero.push({
      Minado: false,
      Revelado: false,
      Bandera: false,
      MinasCerca: 0,
    });
    const Celda = document.createElement("div");
    Celda.classList.add("Celda");
    Celda.dataset.index = i;
    Celda.addEventListener("click", () => Revelar(i, true));
    Celda.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      PonerBandera(i);
    });
    TableroDOM.appendChild(Celda);
  }
  GenerarMinas();
  ObtenerMinasCerca();
}

function NuevaPartida() {
  ResultadoDOM.textContent = "";
  ResultadoDOM.classList.remove("ganar", "perder");
  reiniciarTimer();
  IniciarJuego();
  if (CaraDOM) CaraDOM.src = "assets/img/personaje.jpg";
}

if (btnNuevaPartida) {
  btnNuevaPartida.addEventListener("click", NuevaPartida);
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

function ObtenerMinasCerca() {
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

function Revelar(i, esClickUsuario = false) {
  // Solo inicio el timer si es el primer click real del usuario
  if (esClickUsuario && !juegoIniciado) {
    iniciarTimer();
    juegoIniciado = true;
  }
  const Celda = Tablero[i];
  const CeldaDom = TableroDOM.children[i];

  if (Celda.Revelado || Celda.Bandera) return;

  Celda.Revelado = true;
  CeldaDom.classList.add("Revelada");

  if (Celda.Minado) {
    Perder(CeldaDom);
    return;
  }
  // si no hay minas cercas llamar la funcion revelar de cada casilla libre vecina para verificar nuevamente minas cercanas, asi recursivamente hasta q halla
  if (Celda.MinasCerca > 0) {
    CeldaDom.textContent = Celda.MinasCerca;
  } else {
    ObtenerVecinos(i).forEach((v) => Revelar(v, false));
  }
  VerificarVictoria();
}

function PonerBandera(i) {
  const Celda = Tablero[i];
  const CeldaDom = TableroDOM.children[i];

  if (Celda.Revelado) return;

  Celda.Bandera = !Celda.Bandera;
  if (Celda.Bandera) {
    CeldaDom.classList.add("Bandera");
    MinasRestantes--;
  } else {
    CeldaDom.textContent = "";
    CeldaDom.classList.remove("Bandera");
    MinasTotales++
  }
  
  if (BanderasDOM) {
    BanderasDOM.textContent = `🚩: ${MinasRestantes}`;
  }
  
  VerificarVictoria();
}


let backgroundMusic;
document.addEventListener("DOMContentLoaded", () => {
  backgroundMusic = new Audio("assets/sonidos/rizzlas-c418-224649.mp3");
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.5; 
  backgroundMusic.play();
  IniciarJuego();
  const toggleBtn = document.getElementById("toggleMusicBtn");
  let musicOn = true;
  toggleBtn.addEventListener("click", () => {
    if (musicOn) {
      backgroundMusic.pause();
      toggleBtn.textContent = "🔇 Musica";
    } else {
      backgroundMusic.play();
      toggleBtn.textContent = "🔊 Musica";
    }
    musicOn = !musicOn;
  });
});

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
  const reveladas = Tablero.filter((c) => c.Revelado).length;
  const noMinas = Tablero.filter((c) => !c.Minado).length;
  if (reveladas === noMinas) {
    ResultadoDOM.textContent = "GANASTE";
    ResultadoDOM.classList.add("ganar");
    RevelarCeldas();
    detenerTimer();
  }
}

function Perder(celda) {
  celda.classList.add("Minado");
  RevelarCeldas();
  ResultadoDOM.textContent = "PERDISTE";
  if (CaraDOM) CaraDOM.src = "assets/img/minecraft.png";
  ResultadoDOM.classList.add("perder");
  const explosionAudio = new Audio("assets/sonidos/tnt-explosion.mp3");
  explosionAudio.play();
  detenerTimer();
}

// Variables para el timer
let timerInterval = null;
let timerStart = null;

function iniciarTimer() {
  detenerTimer();
  timerStart = Date.now();
  actualizarTimer();
  timerInterval = setInterval(actualizarTimer, 1000);
}

function detenerTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function actualizarTimer() {
  const timerDom = document.getElementById("Timer");
  if (!timerDom) return;
  if (!timerStart) {
    timerDom.textContent = "Tiempo: 0";
    return;
  }
  const segundos = Math.floor((Date.now() - timerStart) / 1000);
  timerDom.textContent = `Tiempo: ${segundos}`;
}

function reiniciarTimer() {
  detenerTimer();
  timerStart = null;
  const timerDom = document.getElementById("Timer");
  if (timerDom) timerDom.textContent = "Tiempo: 0";
}
