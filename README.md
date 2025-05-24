# NEMO

NEMO es una IA conversacional diseñada para ayudar a adultos mayores a interactuar con tecnología mediante lenguaje natural y voz.

Este proyecto combina:
- 🔹 Un backend en Python (Flask)
- 🔹 Un frontend en React (código fuente incluido en `/frontend`)
- 🔹 Respuesta por texto y síntesis de voz con TTS
- 🔹 Carga de variables sensibles mediante `.env` (ignorado por Git)

---

## 📁 Estructura del proyecto

```
nemo/
├── backend/
│   ├── app.py
│   ├── leer_secrets.py
│   ├── static/
│   ├── templates/
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
├── .gitignore
├── README.md
```

---

## 🚀 Instrucciones básicas

### 🔧 Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # o venv\Scripts\activate en Windows
pip install -r requirements.txt
python app.py
```

(Agregar `requirements.txt` si no lo tienes aún)

### 🧱 Frontend (React)

```bash
cd frontend
npm install
npm run build
```

Copiar el resultado a `backend/templates` y `backend/static` si sirves desde Flask.

---

## 🔐 Seguridad

- `.env` y `.enc` no deben subirse
- Están incluidos en `.gitignore` por defecto

---

## 📝 Licencia

Este proyecto es privado y fue construido como prototipo funcional.
