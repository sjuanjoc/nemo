import os, json, requests
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from TTS.api import TTS
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(dotenv_path="../nemo_secrets.env")


app = Flask(__name__, static_folder="../static", template_folder="../templates")

CORS(app)

SECRET = os.environ.get("ADMIN_PASSWORD")
tts = TTS(model_name="tts_models/es/mai/tacotron2-DDC", progress_bar=False, gpu=False)

codigos_path = Path(__file__).parent.parent / "codigos.json"

@app.route("/validar", methods=["POST"])
def validar():
    if request.headers.get("X-NEMO-TOKEN") != SECRET:
        return jsonify({"error": "Token inválido"}), 403

    data = request.get_json()
    nombre = data.get("nombre", "").strip()
    codigo = data.get("codigo", "").strip()

    if not nombre or not codigo:
        return jsonify({"error": "Faltan datos"}), 400

    try:
        r = requests.get("https://nemo.sjuanjoc.com/codigos.json")
        if r.status_code != 200:
            return jsonify({"error": "No se pudo obtener codigos.json desde el servidor"}), 500
        codigos = r.json()
    except Exception as e:
        return jsonify({"error": f"Error al descargar codigos.json: {str(e)}"}), 500

    if codigo not in codigos:
        return jsonify({"error": "Código inválido"}), 400

    if codigos[codigo] and codigos[codigo] != nombre:
        return jsonify({"error": "Código ya usado por otro usuario"}), 400

    codigos[codigo] = nombre
    json.dump(codigos, open(codigos_path, "w", encoding="utf-8"), indent=2)

    return jsonify({"ok": True})


@app.route("/procesar", methods=["POST"])
def procesar():
    if request.headers.get("X-NEMO-TOKEN") != SECRET:
        return jsonify({"error": "Token inválido"}), 403

    data = request.get_json()
    texto = data.get("texto", "").strip()
    usuario = data.get("usuario", "").strip()

    if not texto or not usuario:
        return jsonify({"error": "Faltan datos"}), 400

    respuesta = f"Hola {usuario}, escuché que dijiste: {texto}"

    fecha = datetime.now().strftime("%Y-%m-%d")
    carpeta_usuario = Path(f"data/usuarios/{usuario}")
    diarios_dir = carpeta_usuario / "diarios"
    audios_dir = carpeta_usuario / "audios" / fecha
    diarios_dir.mkdir(parents=True, exist_ok=True)
    audios_dir.mkdir(parents=True, exist_ok=True)

    ruta_diario = diarios_dir / f"{fecha}.jsonl"
    with open(ruta_diario, "a", encoding="utf-8") as f:
        f.write(json.dumps({
            "hora": datetime.now().strftime("%H:%M:%S"),
            "input": texto,
            "output": respuesta
        }) + "\n")

    nombre_archivo = f"{usuario}_{int(datetime.now().timestamp())}.wav"
    ruta_audio = audios_dir / nombre_archivo
    tts.tts_to_file(text=respuesta, file_path=ruta_audio)

    return jsonify({
        "respuesta": respuesta,
        "audio": f"/audio/{usuario}/{fecha}/{nombre_archivo}"
    })


@app.route("/audio/<usuario>/<fecha>/<nombre>")
def serve_audio(usuario, fecha, nombre):
    path = Path(f"data/usuarios/{usuario}/audios/{fecha}/{nombre}")
    if path.exists():
        return send_file(path, mimetype="audio/wav")
    else:
        return jsonify({"error": "Audio no encontrado"}), 404


@app.route("/usuarios")
def listar_usuarios():
    base = Path("data/usuarios")
    if not base.exists():
        return jsonify([])

    lista = []
    for usuario in base.iterdir():
        if usuario.is_dir():
            total_size = sum(f.stat().st_size for f in usuario.rglob("*") if f.is_file())
            diarios = sum(1 for f in (usuario / "diarios").glob("*.jsonl")) if (usuario / "diarios").exists() else 0
            audios = sum(1 for f in (usuario / "audios").rglob("*.wav")) if (usuario / "audios").exists() else 0
            lista.append({
                "nombre": usuario.name,
                "diarios": diarios,
                "audios": audios,
                "peso": round(total_size / 1024 / 1024, 2)
            })
    return jsonify(lista)

from flask import send_from_directory, render_template

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and (Path("../static") / path).exists():
        return send_from_directory("../static", path)
    else:
        return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
