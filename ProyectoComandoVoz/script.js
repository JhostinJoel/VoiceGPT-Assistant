// función para procesar el envío del formulario de voz
$("#voice-form").submit(function(event) {
  // evitar que se envíe el formulario de forma predeterminada
  event.preventDefault();

  // verificar si el usuario está hablando o escribiendo
  if (isSpeaking()) {
    // detener la grabación de voz
    recognition.stop();
  } else {
    // obtener el texto del campo de entrada de voz
    var text = $("#voice-input").val();
    // enviar la solicitud de voz a Flask
    sendVoiceRequest(text);
    // borrar el texto del campo de entrada de voz
    $("#voice-input").val("");
  }
});

// función para activar/desactivar la grabación de voz
function toggleVoiceRecognition() {
  // verificar si el usuario está hablando o escribiendo
  if (isSpeaking()) {
    // detener la grabación de voz
    recognition.stop();
  } else {
    // crear un nuevo objeto de reconocimiento de voz
    var recognition = new window.SpeechRecognition();
    // configurar el idioma del reconocimiento de voz (puedes cambiar esto según tus necesidades)
    recognition.lang = "es-ES";
    // comenzar a grabar la voz del usuario
    recognition.start();
    // mostrar un indicador de carga
    $("#loading-indicator").show();
    // cuando el reconocimiento de voz haya terminado, enviar la solicitud al servidor Flask
    recognition.onresult = function(event) {
      // obtener el texto reconocido de la respuesta del reconocimiento de voz
      var text = event.results[0][0].transcript;
      // enviar la solicitud de voz a Flask
      sendVoiceRequest(text);
      // ocultar el indicador de carga
      $("#loading-indicator").hide();
    };
  }
}

// función para verificar si el usuario está hablando o escribiendo
function isSpeaking() {
  return recognition && recognition.active;
}

// función para enviar solicitudes de voz a Flask y recibir respuestas de ChatGPT
function sendVoiceRequest(text) {
  console.log("Función sendVoiceRequest() ejecutada.");
  // enviar la solicitud de voz a Flask
  $.ajax({
    type: "POST",
    url: "/voice",
    data: JSON.stringify({ "text": text }),
    contentType: "application/json",
    dataType: "json",
    success: function(response) {
      // actualizar la interfaz de usuario con la respuesta de ChatGPT
      var message = $("<div>", { "class": "chat-message" }).append($("<div>", { "class": "chat-message-text" }).text(response.response));
      $("#chat-container").append(message);
      // convert
