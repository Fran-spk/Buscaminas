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
var ResultadosBtn = document.getElementById('ResultadosBtn');
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
var errorDOM = document.getElementById('ErrorNombreJugador');

function InicializarTablero() {
  TableroDOM.innerHTML = '';
  Tablero = [];
  TableroDOM.style.width = (Columnas * 48) + 'px'; 
  juegoIniciado = false;
  MinasRestantes = MinasTotales;
  if (BanderasDOM) {
    BanderasDOM.textContent = '🚩: ' + MinasRestantes;
  }

  Musica();
  ModoDiaNoche();
  for (var i = 0; i < Filas * Columnas; i++) {
    Tablero.push({
      Minado: false,
      Revelado: false,
      Bandera: false,
      MinasCerca: 0
    });

    var Celda = document.createElement('div');
    Celda.classList.add('Celda');
    Celda.dataset.index = i;

    Celda.addEventListener('click', (function(index) {
      return function() {
        Revelar(index);
      };
    })(i));
    
    Celda.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      PonerBandera(parseInt(this.dataset.index, 10));
    });

    Celda.addEventListener('mousedown', (function(index) {
      return function(e) {
        if ((e.button === 1) || (e.button === 0 && Tablero[index].Revelado && Tablero[index].MinasCerca > 0)) {
          e.preventDefault();
          Chordear(index);
        }
      };
    })(i));

    TableroDOM.appendChild(Celda);
  }
  GenerarMinas();
  ObtenerMinasCerca();
}

function IniciarTimer() {
  if (timer !== null) return;
  contador = 0;
  tiempoInicio = new Date();
  timer = setInterval(function () {
    contador++;
    if (timerDOM) timerDOM.textContent = 'Tiempo: ' + contador;
  }, 1000);
}


function ReiniciarTimer() {
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
  CaraDOM.removeEventListener('click', NuevaPartida); //no dejo empezar partida hasta que se revelen todas las minas
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
      CaraDOM.addEventListener('click', NuevaPartida);
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
    SolicitarNombre();
  }
}

function Perder(celda) {
  celda.classList.add('Minado');
  celda.classList.add('Click');
  RevelarCeldas();
  ResultadoDOM.textContent = 'PERDISTE';
  if (CaraDOM) {
    CaraDOM.src = 'assets/img/minecraft.png';
  }
  ResultadoDOM.classList.add('perder');
  var explosionAudio = new Audio('assets/sonidos/tnt-explosion.mp3');
  explosionAudio.play();
  DetenerTimer();
}

function Revelar(i) {
  if (!juegoIniciado) {
    juegoIniciado = true;
    IniciarTimer();
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

function Chordear(i) {
  var celda = Tablero[i];
  if (!celda.Revelado || celda.MinasCerca === 0) return;

  var vecinos = ObtenerVecinos(i);
  var banderasCerca = vecinos.filter(function(idx) {
    return Tablero[idx].Bandera;
  }).length;

  if (banderasCerca === celda.MinasCerca) {
    vecinos.forEach(function(idx) {
      if (!Tablero[idx].Bandera && !Tablero[idx].Revelado) {
        Revelar(idx);
      }
    });
  }
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
  ReiniciarTimer();
  InicializarTablero();
  if (CaraDOM) {
    CaraDOM.src = 'assets/img/personaje.jpg';
  }
}

CaraDOM.addEventListener('click', NuevaPartida);

document.addEventListener('DOMContentLoaded',  function() {
  Musica();
  Dificultad();
  NuevaPartida();
  AplicarModoGuardado();

  GuardarNombreBtn.addEventListener('click', GuardarNombreJugador);
  CancelarNombreBtn.addEventListener('click', CerrarModal);


  NombreJugadorInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      GuardarNombreJugador();
    }
  });

  ModalNombre.addEventListener('click', function(e) {
    if (e.target === ModalNombre) {
      CerrarModal();
    }
  });
});

DificultadDOM.addEventListener('change', Dificultad);

function Dificultad() {
  var dificultad = DificultadDOM.value;

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

function Musica() {
  var musicOn = true;
  audio.loop = true;
  audio.volume = 0.1;

  function EstadoMusica() {
    if (musicOn) {
      audio.play();
      MusicaDOM.textContent = '🔊 Musica';
    } else {
      audio.pause();
      MusicaDOM.textContent = '🔇 Musica';
    }
    musicOn = !musicOn;
  }

  MusicaDOM.addEventListener('click', EstadoMusica);
}

function ModoDiaNoche() {
  ModoDOM.addEventListener('click', CambiarModo);
}

function AplicarModoGuardado() {
  var modoDia = localStorage.getItem('modoDia') === 'true';

  if (modoDia) {
    document.body.classList.remove('ModoNoche');
    ModoDOM.textContent = '☀️ Modo Día';
  } else {
    document.body.classList.add('ModoNoche');
    ModoDOM.textContent = '🌙 Modo Noche';
  }
}

function CambiarModo() {
  var modoDia = localStorage.getItem('modoDia') === 'true';
  modoDia = !modoDia;
  localStorage.setItem('modoDia', modoDia.toString());
  AplicarModoGuardado();
}

function CargarPartidasGuardadas() {
  var partidas = localStorage.getItem('buscaminas_partidas');
  if (partidas) {
    partidasGuardadas = JSON.parse(partidas);
  }
}

function GuardarPartida(resultado, duracion) {
  var partida = {
    nombre: nombreJugador || 'Jugador',
    duracion: duracion,
    dificultad: DificultadDOM.value,
    fecha: new Date().toLocaleString()
  };
  partidasGuardadas.push(partida);
  localStorage.setItem('buscaminas_partidas', JSON.stringify(partidasGuardadas));
  MostrarHistorial();
}

ResultadosBtn.addEventListener('click', function () {
  const modal = document.getElementById('ModalHistorial');

  if (modal.style.display === 'flex') {
    modal.style.display = 'none';
  } else {
    MostrarHistorial(); 
    modal.style.display = 'flex';
  }
});

document.getElementById('ModalHistorial').addEventListener('click', function(e) {
  if (e.target === this) {
    this.style.display = 'none';
  }
});


function MostrarHistorial() {
  CargarPartidasGuardadas();
  const historialDOM = document.getElementById('Historial');
  const tbody = historialDOM.querySelector('tbody');
  tbody.innerHTML = ''; 

  partidasGuardadas.forEach(function(p) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.fecha}</td>
      <td>${p.nombre}</td>
      <td>${p.duracion} seg</td>
      <td>${p.dificultad}</td>
    `;
    tbody.appendChild(tr);
  });
}


function SolicitarNombre() {
  ModalNombre.style.display = 'block';
  NombreJugadorInput.value = '';
  NombreJugadorInput.focus();
}

function GuardarNombreJugador() {
  var nombre = NombreJugadorInput.value.trim();
  if (nombre === '') {
    errorDOM.textContent = 'Debe ingresar un nombre válido';
    return;
  }
  nombreJugador = nombre;
  errorDOM.textContent = '';
  ModalNombre.style.display = 'none';

  var duracion = contador;
  GuardarPartida(resultado, duracion);
}

function CerrarModal() {
  ModalNombre.style.display = 'none';
  errorDOM.textContent = '';
}
