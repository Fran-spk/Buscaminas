'use strict';

var Filas = 8;
var Columnas = 8;
var MinasTotales = 10;
var MinasRestantes = MinasTotales;
var Tablero = [];
var juegoIniciado = false;
var timer = null;
var contador = 0;
var audio = new Audio('assets/sonidos/rizzlas-c418-224649.mp3');
var partidasGuardadas = [];
var nombreJugador = '';
var tiempoInicio = null;
var TableroDOM = document.getElementById('Tablero');
var ResultadoDOM = document.querySelector('.Resultado');
var btnNuevaPartida = document.getElementById('NuevaPartida');
var CaraDOM = document.getElementById('Cara');
var BanderasDOM = document.getElementById('Banderas');
var timerDOM = document.getElementById('Timer');
var MusicaDOM = document.getElementById('MusicaBtn');
var DificultadDOM = document.getElementById('Dificultad');
var ModoDOM = document.getElementById('ModoBtn');
var ModalNombre = document.getElementById('ModalNombre');
var NombreJugadorInput = document.getElementById('NombreJugador');
var GuardarNombreBtn = document.getElementById('GuardarNombre');
var CancelarNombreBtn = document.getElementById('CancelarNombre');

function InicializarTablero() {
  TableroDOM.innerHTML = '';
  Tablero = [];
  TableroDOM.style.width = (Columnas * 48) + 'px';
  TableroDOM.style.gridTemplateColumns = 'repeat(' + Columnas + ', 48px)';
  juegoIniciado = false;
  MinasRestantes = MinasTotales;
  if (BanderasDOM) {
    BanderasDOM.textContent = '🚩: ' + MinasRestantes;
  }

  Musica();
  ModoDiaNoche();

  for (let i = 0; i < Filas * Columnas; i++) {
  Tablero.push({
    Minado: false,
    Revelado: false,
    Bandera: false,
    MinasCerca: 0
  });

  var Celda = document.createElement('div');
  Celda.classList.add('Celda');
  Celda.dataset.index = i;

  Celda.addEventListener('click', () => Revelar(i));  
  Celda.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    PonerBandera(i);
  });

  TableroDOM.appendChild(Celda);
  }

  GenerarMinas();
  ObtenerMinasCerca();
}

function Musica() {
  var musicOn = true;
  audio.loop = true;
  audio.volume = 0.1;

  function estadoMusica() {
    if (musicOn) {
      audio.play();
      MusicaDOM.textContent = '🔊 Musica';
    } else {
      audio.pause();
      MusicaDOM.textContent = '🔇 Musica';
    }
     musicOn = !musicOn;
  }

  MusicaDOM.addEventListener('click', ()=> estadoMusica());
}

function ModoDiaNoche() {
  var modoDia = true;
  
  function cambiarModo() {
    if (modoDia) {
      document.body.classList.add('modo-noche');
      ModoDOM.textContent = '🌙 Modo Noche';
      modoDia = false;
    } else {
      document.body.classList.remove('modo-noche');
      ModoDOM.textContent = '☀️ Modo Día';
      modoDia = true;
    }
  }

  ModoDOM.addEventListener('click', cambiarModo);
}

// Funciones para LocalStorage
function cargarPartidasGuardadas() {
  const partidas = localStorage.getItem('buscaminas_partidas');
  if (partidas) {
    partidasGuardadas = JSON.parse(partidas);
  }
}

function guardarPartida(resultado, duracion) {
  const partida = {
    nombre: nombreJugador || 'Jugador',
    resultado: resultado, // 'ganar' o 'perder'
    fecha: new Date().toLocaleDateString('es-ES'),
    hora: new Date().toLocaleTimeString('es-ES'),
    duracion: duracion,
    dificultad: DificultadDOM.value,
    minas: MinasTotales,
    filas: Filas,
    columnas: Columnas
  };
  
  partidasGuardadas.push(partida);
  
  // Mantener solo las últimas 50 partidas
  if (partidasGuardadas.length > 50) {
    partidasGuardadas = partidasGuardadas.slice(-50);
  }
  
  localStorage.setItem('buscaminas_partidas', JSON.stringify(partidasGuardadas));
  mostrarHistorial();
}

function mostrarHistorial() {
  const historialContainer = document.getElementById('Historial');
  if (!historialContainer) return;
  
  historialContainer.innerHTML = '<h3>Historial de Partidas</h3>';
  
  if (partidasGuardadas.length === 0) {
    historialContainer.innerHTML += '<p>No hay partidas guardadas</p>';
    return;
  }
  
  const tabla = document.createElement('table');
  tabla.innerHTML = `
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Resultado</th>
        <th>Duración</th>
        <th>Dificultad</th>
        <th>Fecha</th>
        <th>Hora</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  
  const tbody = tabla.querySelector('tbody');
  partidasGuardadas.slice().reverse().forEach(partida => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${partida.nombre}</td>
      <td class="${partida.resultado}">${partida.resultado === 'ganar' ? '✅ Ganó' : '❌ Perdió'}</td>
      <td>${partida.duracion}s</td>
      <td>${partida.dificultad}</td>
      <td>${partida.fecha}</td>
      <td>${partida.hora}</td>
    `;
    tbody.appendChild(fila);
  });
  
  historialContainer.appendChild(tabla);
}

function solicitarNombre() {
  ModalNombre.style.display = 'block';
  NombreJugadorInput.value = '';
  NombreJugadorInput.focus();
}

function cerrarModal() {
  ModalNombre.style.display = 'none';
}

function guardarNombreJugador() {
  nombreJugador = NombreJugadorInput.value.trim() || 'Jugador';
  cerrarModal();
  
  // Guardar la partida inmediatamente después de confirmar el nombre
  const resultadoActual = ResultadoDOM.textContent === 'GANASTE' ? 'ganar' : 'perder';
  guardarPartida(resultadoActual, contador);
}

function iniciarTimer() {
  if (timer !== null) return;
  contador = 0;
  tiempoInicio = new Date();
  timer = setInterval(function () {
    contador++;
    if (timerDOM) timerDOM.textContent = 'Tiempo: ' + contador;
  }, 1000);
}

function reiniciarTimer() {
  clearInterval(timer);
  timer = null;
  contador = 0;
  if (timerDOM) timerDOM.textContent = 'Tiempo: 0';
}

function DetenerTimer() {
  clearInterval(timer);
}

function ObtenerVecinos(celda) {
  var fila = Math.floor(celda / Columnas);
  var col = celda % Columnas;
  var vecinos = [];
  var i, j, F, C;
  for (i = -1; i <= 1; i++) {
    for (j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      F = fila + i;
      C = col + j;
      if (F >= 0 && F < Filas && C >= 0 && C < Columnas) {
        vecinos.push(F * Columnas + C);
      }
    }
  }
  return vecinos;
}

function GenerarMinas() {
  var Colocadas = 0;
  while (Colocadas < MinasTotales) {
    var i = Math.floor(Math.random() * Tablero.length);
    if (!Tablero[i].Minado) {
      Tablero[i].Minado = true;
      Colocadas++;
    }
  }
}

function ObtenerMinasCerca() {
  var i;
  for (i = 0; i < Tablero.length; i++) {
    if (Tablero[i].Minado) continue;
    var Vecinos = ObtenerVecinos(i);
    var minas = Vecinos.filter(function (v) {
      return Tablero[v].Minado;
    }).length;
    Tablero[i].MinasCerca = minas;
  }
}

function RevelarCeldas() {
  setTimeout(function () {
    var i;
    for (i = 0; i < Tablero.length; i++) {
      var celda = Tablero[i];
      var celdaDOM = TableroDOM.children[i];
      celdaDOM.classList.add('Revelada');
      celda.Revelado = true;
      if (celda.Minado) {
        celdaDOM.classList.add('Minado');
        continue;
      }
      if (celda.MinasCerca > 0) {
        celdaDOM.textContent = celda.MinasCerca;
      }
    }
  }, 1000);
}

function VerificarVictoria() {
  var reveladas = Tablero.filter(function (c) {
    return c.Revelado;
  }).length;
  var noMinas = Tablero.filter(function (c) {
    return !c.Minado;
  }).length;
  if (reveladas === noMinas) {
    ResultadoDOM.textContent = 'GANASTE';
    ResultadoDOM.classList.add('ganar');
    RevelarCeldas();
    DetenerTimer();
    solicitarNombre();
  }
}

function Perder(celda) {
  celda.classList.add('Minado');
  RevelarCeldas();
  ResultadoDOM.textContent = 'PERDISTE';
  if (CaraDOM) {
    CaraDOM.src = 'assets/img/minecraft.png';
  }
  ResultadoDOM.classList.add('perder');
  var explosionAudio = new Audio('assets/sonidos/tnt-explosion.mp3');
  explosionAudio.play();
  DetenerTimer();
  solicitarNombre();
}

function Revelar(i) {
  if (!juegoIniciado) {
    juegoIniciado = true;
    iniciarTimer();
  }

  var Celda = Tablero[i];
  var CeldaDom = TableroDOM.children[i];

  if (Celda.Revelado || Celda.Bandera) return;

  Celda.Revelado = true;
  CeldaDom.classList.add('Revelada');

  if (Celda.Minado) {
    Perder(CeldaDom);
    return;
  }

  if (Celda.MinasCerca > 0) {
    CeldaDom.textContent = Celda.MinasCerca;
  } else {
    var vecinos = ObtenerVecinos(i);
    vecinos.forEach(function (v) {
      Revelar(v);
    });
  }

  VerificarVictoria();
}

function PonerBandera(i) {
  var Celda = Tablero[i];
  var CeldaDom = TableroDOM.children[i];

  if (Celda.Revelado) return;

  Celda.Bandera = !Celda.Bandera;
  if (Celda.Bandera) {
    CeldaDom.classList.add('Bandera');
    MinasRestantes--;
  } else {
    CeldaDom.textContent = '';
    CeldaDom.classList.remove('Bandera');
    MinasRestantes++;
  }

  BanderasDOM.textContent = '🚩: ' + MinasRestantes;
  VerificarVictoria();
}


function NuevaPartida() {
  ResultadoDOM.textContent = '';
  ResultadoDOM.classList.remove('ganar', 'perder');
  reiniciarTimer();
  InicializarTablero();
  if (CaraDOM) {
    CaraDOM.src = 'assets/img/personaje.jpg';
  }
}

CaraDOM.addEventListener('click', () => {
  NuevaPartida();
});

document.addEventListener('DOMContentLoaded',  () => {
  cargarPartidasGuardadas();
  Musica();
  Dificultad();
  NuevaPartida();
  mostrarHistorial();
  
  // Event listeners para el modal
  GuardarNombreBtn.addEventListener('click', guardarNombreJugador);
  CancelarNombreBtn.addEventListener('click', cerrarModal);
  
  // Cerrar modal con Enter
  NombreJugadorInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      guardarNombreJugador();
    }
  });
  
  // Cerrar modal haciendo clic fuera
  ModalNombre.addEventListener('click', function(e) {
    if (e.target === ModalNombre) {
      cerrarModal();
    }
  });
});

DificultadDOM.addEventListener('change', Dificultad);

function Dificultad() {
    const dificultad = DificultadDOM.value;

    switch (dificultad) {
        case 'facil':
            Filas = 8;
            Columnas = 8;
            MinasTotales = 10;
            break;
        case 'intermedio': 
            Filas = 12;
            Columnas = 12;
            MinasTotales = 25;
            break;
        case 'dificil': 
            Filas = 16;
            Columnas = 16;
            MinasTotales = 40;
            break;
        default: 
            Filas = 8;
            Columnas = 8;
            MinasTotales = 10;
    }
    NuevaPartida();
  }