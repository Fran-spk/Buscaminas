var contactoForm = document.getElementById('contactoForm');
var nombreInput = document.getElementById('nombre');
var emailInput = document.getElementById('email');
var destinatarioInput = document.getElementById('destinatario');
var mensajeInput = document.getElementById('mensaje');
var btnEnviar = document.querySelector('.btn-enviar');

var nombreError = document.getElementById('nombreError');
var emailError = document.getElementById('emailError');
var mensajeError = document.getElementById('mensajeError');

var MusicaDOM = document.getElementById('MusicaBtn');


function validarNombre(nombre) {
  var regex = /^[a-zA-Z0-9\s]+$/;

  if (!nombre.trim()) {
    return { valido: false, mensaje: 'El nombre es obligatorio' };
  }

  if (nombre.trim().length < 2) {
    return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres' };
  }

  if (!regex.test(nombre)) {
    return { valido: false, mensaje: 'El nombre solo puede contener letras, números y espacios' };
  }

  return { valido: true, mensaje: '' };
}

function validarEmail(email) {
  // Regex para validar formato de email
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim()) {
    return { valido: false, mensaje: 'El email es obligatorio' };
  }

  if (!regex.test(email)) {
    return { valido: false, mensaje: 'Ingresa un email válido (ejemplo: usuario@dominio.com)' };
  }

  return { valido: true, mensaje: '' };
}


function validarMensaje(mensaje) {
  if (!mensaje.trim()) {
    return { valido: false, mensaje: 'El mensaje es obligatorio' };
  }

  if (mensaje.trim().length < 5) {
    return { valido: false, mensaje: 'El mensaje debe tener al menos 5 caracteres' };
  }

  return { valido: true, mensaje: '' };
}


function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.display = 'block';
}


function limpiarError(elemento) {
  elemento.textContent = '';
  elemento.style.display = 'none';
}

function marcarCampo(campo, esValido) {
  campo.classList.remove('CampoError', 'CampoExito');
  if (esValido) {
    campo.classList.add('CampoExito');
  } else {
    campo.classList.add('CampoError');
  }
}

// Función para validar campo en tiempo real
function validarCampoEnTiempoReal(campo, validacionFunc, errorElement) {
  var valor = campo.value;
  var resultado = validacionFunc(valor);

  if (resultado.valido) {
    limpiarError(errorElement);
    marcarCampo(campo, true);
  } else {
    mostrarError(errorElement, resultado.mensaje);
    marcarCampo(campo, false);
  }

  return resultado.valido;
}

// Función para validar todo el formulario
function validarFormulario() {
  var nombreValido = validarCampoEnTiempoReal(nombreInput, validarNombre, nombreError);
  var emailValido = validarCampoEnTiempoReal(emailInput, validarEmail, emailError);
  var mensajeValido = validarCampoEnTiempoReal(mensajeInput, validarMensaje, mensajeError);

  return nombreValido && emailValido && mensajeValido;
}

// Función para abrir el cliente de email
function abrirClienteEmail(nombre, email, destinatario, mensaje) {
  var asunto = 'Contacto desde Buscaminas';
  var cuerpo = 'Nombre: ' + nombre + '\nEmail: ' + email + '\n\nMensaje:\n' + mensaje;

  var mailtoLink = 'mailto:' + encodeURIComponent(destinatario) + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
  window.location.href = mailtoLink;
}


nombreInput.addEventListener('input', function() {
  validarCampoEnTiempoReal(nombreInput, validarNombre, nombreError);
});

emailInput.addEventListener('input', function() {
  validarCampoEnTiempoReal(emailInput, validarEmail, emailError);
});

mensajeInput.addEventListener('input', function() {
  validarCampoEnTiempoReal(mensajeInput, validarMensaje, mensajeError);
});


contactoForm.addEventListener('submit', function(e) {
  e.preventDefault();

  if (validarFormulario()) {
   
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';


    var nombre = nombreInput.value.trim();
    var email = emailInput.value.trim();
    var destinatario = destinatarioInput.value.trim();
    var mensaje = mensajeInput.value.trim();


    abrirClienteEmail(nombre, email, destinatario, mensaje);

    setTimeout(function() {
      contactoForm.reset();


      limpiarError(nombreError);
      limpiarError(emailError);
      limpiarError(mensajeError);


      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar Mensaje';


      nombreInput.classList.remove('CampoError', 'CampoExito');
      emailInput.classList.remove('CampoError', 'CampoExito');
      mensajeInput.classList.remove('CampoError', 'CampoExito');
    }, 1000);
  }
});

contactoForm.addEventListener('reset', function() {

  limpiarError(nombreError);
  limpiarError(emailError);
  limpiarError(mensajeError);
  nombreInput.classList.remove('CampoError', 'CampoExito');
  emailInput.classList.remove('CampoError', 'CampoExito');
  mensajeInput.classList.remove('CampoError', 'CampoExito');


  btnEnviar.disabled = false;
  btnEnviar.textContent = 'Enviar Mensaje';
});




function Musica() {
  var musicOn = true;
  var audio = new Audio('assets/sonidos/rizzlas-c418-224649.mp3');
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

  MusicaDOM.addEventListener('click', function() {
    estadoMusica();
  });
}

document.addEventListener('DOMContentLoaded', function() {
  Musica();
  ModoDiaNoche();
});
