import os
import json
import random
import string
from datetime import datetime
from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
from pathlib import Path
from TTS.api import TTS
from dotenv import load_dotenv

app = Flask(__name__, static_folder="../static", template_folder="../templates")
CORS(app)

SECRET = os.environ.get("ADMIN_PASSWORD")
tts = TTS(model_name="tts_models/es/mai/tacotron2-DDC", progress_bar=False, gpu=False)

codigos_path = Path(__file__).parent / "codigos.json"
usuarios_path = Path(__file__).parent / "usuarios.json"

@app.route('/api/nuevo_codigo', methods=['POST'])
def nuevo_codigo():
    codigo = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    if codigos_path.exists():
        with open(codigos_path, 'r', encoding='utf-8') as f:
            codigos = json.load(f)
    else:
        codigos = []
    nuevo_id = f"codigo_{int(datetime.now().timestamp())}"
    codigos.append({"id": nuevo_id, "code": codigo, "status": "disponible"})
    with open(codigos_path, 'w', encoding='utf-8') as f:
        json.dump(sorted(codigos, key=lambda x: x["code"]), f, indent=2, ensure_ascii=False)
    return {"id": nuevo_id, "code": codigo, "status": "disponible"}

@app.route('/api/actualizar_codigo', methods=['POST'])
def actualizar_codigo():
    data = request.get_json()
    code_actualizar = data.get("code")
    nuevo_status = data.get("status")  # "usado", "disponible", etc.
    usuario = data.get("username", "")  # Usa username para coherencia
    if codigos_path.exists():
        with open(codigos_path, 'r', encoding='utf-8') as f:
            codigos = json.load(f)
    else:
        codigos = []
    for code_obj in codigos:
        if code_obj["code"] == code_actualizar:
            code_obj["status"] = nuevo_status
            if nuevo_status == "usado" and usuario:
                code_obj["usuario"] = usuario
            elif nuevo_status == "disponible" and "usuario" in code_obj:
                del code_obj["usuario"]
            break
    with open(codigos_path, 'w', encoding='utf-8') as f:
        json.dump(sorted(codigos, key=lambda x: x["code"]), f, indent=2, ensure_ascii=False)
    return {"mensaje": "Estado actualizado"}

@app.route('/api/codigos', methods=['GET'])
def codigos():
    # Devuelve los códigos como objeto: { "nombre": "CODE1234", ... }
    if codigos_path.exists():
        with open(codigos_path, 'r', encoding='utf-8') as f:
            codigos = json.load(f)
    else:
        codigos = []
    data = {}
    for code_obj in codigos:
        # Si ya tiene usuario registrado, usa el username como clave
        if code_obj["status"] == "usado" and "usuario" in code_obj:
            data[code_obj["usuario"]] = code_obj["code"]
        else:
            data[code_obj["id"]] = code_obj["code"]
    return data

@app.route('/api/usuarios', methods=['GET'])
def api_usuarios():
    # Devuelve la lista de usuarios según tu estructura esperada
    if usuarios_path.exists():
        with open(usuarios_path, 'r', encoding='utf-8') as f:
            usuarios = json.load(f)
    else:
        usuarios = []
    return jsonify({"usuarios": usuarios})

@app.route("/api/registrar_usuario", methods=["POST"])
def registrar_usuario():
    data = request.get_json()
    name = data.get("name", "")
    username = data.get("username", "")
    code = data.get("code", "")
    weight = data.get("weight", 0)
    date = data.get("date", datetime.now().strftime("%Y-%m-%d"))
    if not name or not username or not code:
        return jsonify({"error": "Faltan datos"}), 400
    if usuarios_path.exists():
        with open(usuarios_path, 'r', encoding='utf-8') as f:
            usuarios = json.load(f)
    else:
        usuarios = []
    user_id = f"user-{len(usuarios)+1}"
    usuarios.append({
        "id": user_id,
        "name": name,
        "username": username,
        "code": code,
        "weight": weight,
        "date": date
    })
    with open(usuarios_path, 'w', encoding='utf-8') as f:
        json.dump(usuarios, f, indent=2, ensure_ascii=False)
    return jsonify({"mensaje": "Usuario registrado", "user": user_id})

# --- SERVICIO DEL FRONTEND ---
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    return render_template("index.html")

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username", "").strip()
    codigo = request.form.get("codigo", "").strip()

    if not username or not codigo:
        return "Faltan datos", 400

    if codigos_path.exists():
        with open(codigos_path, 'r', encoding='utf-8') as f:
            codigos = json.load(f)
    else:
        return "No hay códigos generados", 400

    for code_obj in codigos:
        if code_obj["code"] == codigo:
            if code_obj["status"] == "disponible" or (
                code_obj["status"] == "usado" and code_obj.get("usuario") == username
            ):
                if code_obj["status"] == "disponible":
                    code_obj["status"] = "usado"
                    code_obj["usuario"] = username
                    with open(codigos_path, 'w', encoding='utf-8') as f:
                        json.dump(codigos, f, indent=2, ensure_ascii=False)
                # RESPONDE JSON:
                return jsonify({
                    "id": username,
                    "username": username,
                    "name": username  # o cambia aquí si tienes el nombre completo en otro lado
                }), 200
            else:
                return "Código ya está usado por otro usuario", 403
    return "Código inválido", 403

@app.route('/api/eliminar_codigo', methods=['POST'])
def eliminar_codigo():
    data = request.get_json()
    id_a_eliminar = data.get("id")
    if codigos_path.exists():
        with open(codigos_path, 'r', encoding='utf-8') as f:
            codigos = json.load(f)
    else:
        return {"error": "No hay codigos"}, 404
    codigos = [c for c in codigos if c["id"] != id_a_eliminar]
    with open(codigos_path, 'w', encoding='utf-8') as f:
        json.dump(codigos, f, indent=2, ensure_ascii=False)
    return {"mensaje": "Código eliminado"}

@app.route('/api/eliminar_usuario', methods=['POST'])
def eliminar_usuario():
    data = request.get_json()
    id_a_eliminar = data.get("id")
    if usuarios_path.exists():
        with open(usuarios_path, 'r', encoding='utf-8') as f:
            usuarios = json.load(f)
    else:
        return {"error": "No hay usuarios"}, 404
    usuarios = [u for u in usuarios if u["id"] != id_a_eliminar]
    with open(usuarios_path, 'w', encoding='utf-8') as f:
        json.dump(usuarios, f, indent=2, ensure_ascii=False)
    return {"mensaje": "Usuario eliminado"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
