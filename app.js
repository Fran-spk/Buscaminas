const Filas = 10;
const Columnas = 10;
const MinasTotales = 10;
let MinasRestantes = MinasTotales;
let Tablero = [];
let juegoIniciado = false;
let timer = null;      
let contador = 0;   
let audio = new Audio("assets/sonidos/rizzlas-c418-224649.mp3");
const TableroDOM = document.getElementById("Tablero");
const ResultadoDOM = document.querySelector(".Resultado");
const btnNuevaPartida = document.getElementById("NuevaPartida")
const CaraDOM = document.getElementById("Cara");
const BanderasDOM = document.getElementById("Banderas");
const timerDOM = document.getElementById("Timer");
const MusicaDOM = document.getElementById("MusicaBtn");

function IniciarJuego() {
  TableroDOM.innerHTML = "";
  Tablero = [];
  TableroDOM.style.gridTemplateColumns = `repeat(${Columnas}, 48px)`;
  juegoIniciado = false; // Reinicio el estado del juego
  MinasRestantes = MinasTotales;
  if (BanderasDOM) {
    BanderasDOM.textContent = `🚩: ${MinasRestantes}`;
  }
  Musica(true);
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

CaraDOM.addEventListener("click", () => {
  NuevaPartida();
});





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

function Revelar(i) {

  const reveladas = Tablero.some(casilla => casilla.Revelado === true); //la primera vez que se revela una celda inicia el contador

  if (!reveladas) {
    iniciarTimer();
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
    MinasRestantes++
  }
  BanderasDOM.textContent = `🚩: ${MinasRestantes}`;
  VerificarVictoria();
}

function Musica() {
  let musicOn = true;
  audio.loop = true;
  audio.volume = 0.1;

  function actualizarEstado() {
    if (musicOn) {
      audio.play();
      MusicaDOM.textContent = "🔊 Musica";
    } else {
      audio.pause();
      MusicaDOM.textContent = "🔇 Musica";
    }
  }

  MusicaDOM.addEventListener("click", () => {
    musicOn = !musicOn;
    actualizarEstado();
  });
  actualizarEstado();
}

document.addEventListener("DOMContentLoaded", () => {
  Musica();      
  NuevaPartida();
});

function RevelarCeldas() {
  setTimeout(() => {
    for (let i = 0; i < Tablero.length; i++) {
    const celda = Tablero[i];
    const celdaDOM = TableroDOM.children[i];

    celdaDOM.classList.add("Revelada");
    celda.Revelado = true;
    if (celda.Minado) {
      celdaDOM.classList.add("Minado");
      continue;
    }
    if (celda.MinasCerca > 0) {
      celdaDOM.textContent = celda.MinasCerca;
    }
  }
  }, 1000);
}

function VerificarVictoria() {
  const reveladas = Tablero.filter((c) => c.Revelado).length;
  const noMinas = Tablero.filter((c) => !c.Minado).length;
  if (reveladas === noMinas) {
    ResultadoDOM.textContent = "GANASTE";
    ResultadoDOM.classList.add("ganar");
    RevelarCeldas();
    DetenerTimer();
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
  DetenerTimer();
}


function iniciarTimer() {
  if (timer !== null) return; 
  contador = 0;

  timer = setInterval(() => {
    contador++;
    if (timerDOM) timerDOM.textContent = `Tiempo: ${contador}`;
  }, 1000);
}



function reiniciarTimer() {
  clearInterval(timer);
  timer = null;
  contador = 0;
  if (timerDOM) timerDOM.textContent = "Tiempo: 0";
}

function DetenerTimer(){
   clearInterval(timer);
}