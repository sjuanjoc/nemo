import os
import google.generativeai as genai
import openai

# Ejecutar primero el script de carga
import leer_secrets  # Esto carga las claves en os.environ

# Configurar Gemini
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Configurar OpenAI
openai.api_key = os.environ["OPENAI_API_KEY"]

# Función principal
def nemo_responde(mensaje):
    try:
        model = genai.GenerativeModel("models/gemini-2.0-flash")
        respuesta = model.generate_content(mensaje).text.strip()
        if len(respuesta) > 600:
            return "Tienes toda la información en la pantalla."
        return respuesta
    except:
        try:
            respuesta = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": mensaje}]
            ).choices[0].message["content"].strip()
            if len(respuesta) > 600:
                return "Tienes toda la información en la pantalla."
            return respuesta
        except:
            return "Lo siento, no pude responder en este momento."

# Prueba rápida
if __name__ == "__main__":
    mensaje = input("👵 ¿Qué desea preguntar?: ")
    print("\n🧠 NEMO dice:\n")
    print(nemo_responde(mensaje))
