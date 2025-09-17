# Usar imagen ligera de Python
FROM python:3.11-slim

# Configurar directorio de trabajo
WORKDIR /app

# Copiar requirements primero para mejor caching
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de archivos
COPY . .

# Exponer puerto (Cloud Run usa PORT env var)
EXPOSE 8080

# Comando para ejecutar la app
CMD exec python app.py