from cryptography.fernet import Fernet
import hashlib
import os

# Leer archivo cifrado
with open("nemo_secrets.enc", "rb") as f:
    clave_guardada = f.readline().strip()
    datos_cifrados = f.read()

# Ingresar clave maestra
clave = input("🔐 Ingresa tu MASTER_KEY: ").encode()

# Generar clave Fernet
clave_segura = hashlib.sha256(clave).digest()
fernet = Fernet(clave_guardada)

# Descifrar
try:
    datos = fernet.decrypt(datos_cifrados).decode()
    print("✅ Claves cargadas correctamente.")
except:
    print("❌ Clave incorrecta o archivo dañado.")
    exit()

# Crear variables de entorno temporales
for linea in datos.strip().split("\n"):
    if "=" in linea:
        k, v = linea.strip().split("=", 1)
        os.environ[k] = v
