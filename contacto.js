// Variables del formulario
const contactoForm = document.getElementById('contactoForm');
const nombreInput = document.getElementById('nombre');
const emailInput = document.getElementById('email');
const destinatarioInput = document.getElementById('destinatario');
const mensajeInput = document.getElementById('mensaje');
const btnEnviar = document.querySelector('.btn-enviar');

// Elementos de error
const nombreError = document.getElementById('nombreError');
const emailError = document.getElementById('emailError');
const mensajeError = document.getElementById('mensajeError');

// Variables para el modo día/noche
const MusicaDOM = document.getElementById('MusicaBtn');
const ModoDOM = document.getElementById('ModoBtn');

// Función para validar nombre (alfanumérico)
function validarNombre(nombre) {
  // Debe contener solo letras, números y espacios
  const regex = /^[a-zA-Z0-9\s]+$/;
  
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

// Función para validar email
function validarEmail(email) {
  // Regex para validar formato de email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.trim()) {
    return { valido: false, mensaje: 'El email es obligatorio' };
  }
  
  if (!regex.test(email)) {
    return { valido: false, mensaje: 'Ingresa un email válido (ejemplo: usuario@dominio.com)' };
  }
  
  return { valido: true, mensaje: '' };
}



// Función para validar mensaje
function validarMensaje(mensaje) {
  if (!mensaje.trim()) {
    return { valido: false, mensaje: 'El mensaje es obligatorio' };
  }
  
  if (mensaje.trim().length < 5) {
    return { valido: false, mensaje: 'El mensaje debe tener al menos 5 caracteres' };
  }
  
  return { valido: true, mensaje: '' };
}

// Función para mostrar error
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.display = 'block';
}

// Función para limpiar error
function limpiarError(elemento) {
  elemento.textContent = '';
  elemento.style.display = 'none';
}

// Función para marcar campo como válido/inválido
function marcarCampo(campo, esValido) {
  campo.classList.remove('CampoError', 'CampoExito');
  campo.classList.add(esValido ? 'CampoExito' : 'CampoError');
}

// Función para validar campo en tiempo real
function validarCampoEnTiempoReal(campo, validacionFunc, errorElement) {
  const valor = campo.value;
  const resultado = validacionFunc(valor);
  
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
  const nombreValido = validarCampoEnTiempoReal(nombreInput, validarNombre, nombreError);
  const emailValido = validarCampoEnTiempoReal(emailInput, validarEmail, emailError);
  const mensajeValido = validarCampoEnTiempoReal(mensajeInput, validarMensaje, mensajeError);
  
  return nombreValido && emailValido && mensajeValido;
}

// Función para abrir el cliente de email
function abrirClienteEmail(nombre, email, destinatario, mensaje) {
  const asunto = 'Contacto desde Buscaminas';
  const cuerpo = `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`;
  
  // Crear el enlace mailto con destinatario específico
  const mailtoLink = `mailto:${encodeURIComponent(destinatario)}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
  
  // Abrir el cliente de email predeterminado
  window.location.href = mailtoLink;
}

// Event listeners para validación en tiempo real
nombreInput.addEventListener('input', () => {
  validarCampoEnTiempoReal(nombreInput, validarNombre, nombreError);
});

emailInput.addEventListener('input', () => {
  validarCampoEnTiempoReal(emailInput, validarEmail, emailError);
});

mensajeInput.addEventListener('input', () => {
  validarCampoEnTiempoReal(mensajeInput, validarMensaje, mensajeError);
});

// Event listener para el envío del formulario
contactoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  if (validarFormulario()) {
    // Deshabilitar botón durante el envío
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';
    
    // Obtener valores del formulario
    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const destinatario = destinatarioInput.value.trim();
    const mensaje = mensajeInput.value.trim();
    
    // Abrir cliente de email
    abrirClienteEmail(nombre, email, destinatario, mensaje);
    
    // Mostrar mensaje de éxito
    setTimeout(() => {
      alert('¡Mensaje enviado! Se ha abierto tu cliente de email predeterminado.');
      
      // Limpiar formulario
      contactoForm.reset();
      
      // Limpiar errores
      limpiarError(nombreError);
      limpiarError(emailError);
      limpiarError(mensajeError);
      
      // Restaurar botón
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar Mensaje';
      
      // Limpiar clases de validación
      nombreInput.classList.remove('CampoError', 'CampoExito');
      emailInput.classList.remove('CampoError', 'CampoExito');
      mensajeInput.classList.remove('CampoError', 'CampoExito');
    }, 1000);
  }
});

// Event listener para limpiar formulario
contactoForm.addEventListener('reset', function() {
  // Limpiar errores
  limpiarError(nombreError);
  limpiarError(emailError);
  limpiarError(mensajeError);
  
  // Limpiar clases de validación
  nombreInput.classList.remove('CampoError', 'CampoExito');
  emailInput.classList.remove('CampoError', 'CampoExito');
  mensajeInput.classList.remove('CampoError', 'CampoExito');
  
  // Restaurar botón
  btnEnviar.disabled = false;
  btnEnviar.textContent = 'Enviar Mensaje';
});

// Función para el modo día/noche
function ModoDiaNoche() {
  var modoDia = true;
  
  function cambiarModo() {
    if (modoDia) {
      document.body.classList.add('ModoNoche');
      ModoDOM.textContent = '🌙 Modo Noche';
      modoDia = false;
    } else {
      document.body.classList.remove('ModoNoche');
      ModoDOM.textContent = '☀️ Modo Día';
      modoDia = true;
    }
  }

  ModoDOM.addEventListener('click', cambiarModo);
}

// Función para música
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

  MusicaDOM.addEventListener('click', ()=> estadoMusica());
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  Musica();
  ModoDiaNoche();
}); 