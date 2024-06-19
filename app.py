import openai
import speech_recognition as sr
import pyttsx3

# Configurar OpenAI con tu API key
openai.api_key = "aCKPwiKh8XWzWHOWrG6MT3BlbkFJxqWxg21R8UDpnLdAwL7y"

# Función para obtener una respuesta de ChatGPT
def get_response(prompt):
    try:
        response = openai.Completion.create(
            engine="davinci-codex",
            prompt=prompt,
            max_tokens=100,
            stop=None
        )
        return response['choices'][0]['text'].strip()
    except Exception as e:
        print(f"Error al llamar a la API de OpenAI: {e}")
        return ""

# Función para convertir el audio a texto usando SpeechRecognition
def recognize_speech():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Habla ahora...")
        audio = r.listen(source)
        try:
            text = r.recognize_google(audio, language='es-ES')
            # Limpiar la entrada de voz
            cleaned_text = ' '.join(text.split()).lower()
            return cleaned_text
        except sr.UnknownValueError:
            print("No se pudo entender el audio")
            return ""
        except sr.RequestError as e:
            print(f"Error al conectarse al servidor de voz: {e}")
            return ""

# Función para hablar la respuesta en lugar de mostrarla en la consola
def speak_response(response):
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)
    engine.say(response)
    engine.runAndWait()

# Loop principal para recibir preguntas y proporcionar respuestas
while True:
    # Obtener la pregunta del usuario por voz
    question = recognize_speech()
    if question:
        # Mostrar la pregunta en la consola
        print("Pregunta: " + question)

        # Salir del bucle si el usuario dice "adiós" o "salir"
        if question in ["adios", "salir"]:
            break

        # Obtener la respuesta de ChatGPT
        response = get_response(question)

        if response:
            # Mostrar la respuesta en la consola
            print("Respuesta: " + response)
            # Hablar la respuesta
            speak_response(response)
        else:
            print("No se pudo obtener una respuesta de ChatGPT")
