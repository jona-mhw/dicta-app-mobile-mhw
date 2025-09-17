# 🚀 Guía de Despliegue - Dicta App

Esta guía te ayudará a desplegar la aplicación Dicta App en Google Cloud Run de manera gratuita.

## 📋 Prerrequisitos

### 1. Instalar Google Cloud CLI
```bash
# Windows (usando Chocolatey)
choco install gcloudsdk

# macOS (usando Homebrew)
brew install --cask google-cloud-sdk

# Linux (usando apt)
sudo apt-get install google-cloud-cli
```

### 2. Autenticar con Google Cloud
```bash
gcloud auth login
gcloud auth application-default login
```

### 3. Habilitar APIs necesarias
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

## ⚙️ Configuración del Proyecto

### 1. Crear/Seleccionar Proyecto
```bash
# Crear nuevo proyecto (opcional)
gcloud projects create tu-proyecto-id

# Configurar proyecto activo
gcloud config set project tu-proyecto-id

# Verificar configuración
gcloud config get-value project
```

### 2. Configurar región por defecto
```bash
gcloud config set run/region us-central1
```

## 🐳 Archivos de Configuración

### Dockerfile
El proyecto incluye un `Dockerfile` optimizado:
- Imagen base: `python:3.11-slim`
- Puerto: 8080 (estándar de Cloud Run)
- Optimizado para el tier gratuito

### Configuración de la aplicación
El archivo `app.py` está configurado para:
- Detectar automáticamente el puerto de Cloud Run
- Funcionar tanto en desarrollo como en producción
- Soportar WebSockets en Cloud Run

## 🚀 Despliegue

### Opción 1: Script Automático (Recomendado)

**Windows (PowerShell):**
```powershell
.\deploy.ps1
```

**Linux/macOS:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Opción 2: Comando Manual

```bash
gcloud run deploy dictapp-mhw \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --platform managed \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 80 \
  --max-instances 10 \
  --min-instances 0 \
  --cpu-throttling \
  --execution-environment gen2 \
  --port 8080 \
  --set-env-vars "FLASK_ENV=production"
```

## 💰 Configuración Tier Gratuito

### Límites del Tier Gratuito de Cloud Run:
- ✅ **2,000,000 requests por mes**
- ✅ **360,000 GB-segundos de CPU por mes**
- ✅ **180,000 vCPU-segundos por mes**
- ✅ **2,000,000 requests por mes**

### Configuración Optimizada:
- **Memoria**: 512Mi (mínimo recomendado)
- **CPU**: 1 vCPU
- **Min instances**: 0 (no paga cuando no se usa)
- **Max instances**: 10 (escala según demanda)
- **CPU throttling**: Activado (reduce costos)
- **Concurrency**: 80 requests por instancia

## 🔧 Comandos Útiles

### Ver logs en tiempo real
```bash
gcloud run services logs tail dictapp-mhw --region=us-central1
```

### Ver información del servicio
```bash
gcloud run services describe dictapp-mhw --region=us-central1
```

### Actualizar variables de entorno
```bash
gcloud run services update dictapp-mhw \
  --region=us-central1 \
  --set-env-vars "NEW_VAR=value"
```

### Eliminar el servicio
```bash
gcloud run services delete dictapp-mhw --region=us-central1
```

## 🌐 Acceso a la Aplicación

Después del despliegue, tu aplicación estará disponible en:
```
https://dictapp-mhw-[PROJECT-NUMBER].us-central1.run.app
```

### Uso:
1. **Celular**: Abre la URL y selecciona "Iniciar Dictado"
2. **PC**: Abre la URL y selecciona "Recibir Texto"
3. **Conectar**: Usa el código de 6 dígitos para vincular dispositivos
4. **Dictar**: Habla en el celular y ve el texto aparecer en la PC

## 🛡️ Seguridad y Mejores Prácticas

### Variables de Entorno Sensibles
```bash
# Para datos sensibles, usa Secret Manager
gcloud secrets create app-secret --data-file=secret.txt

# Montar secreto en Cloud Run
gcloud run services update dictapp-mhw \
  --region=us-central1 \
  --set-secrets="/secrets/app=app-secret:latest"
```

### Dominios Personalizados
```bash
# Mapear dominio personalizado
gcloud run domain-mappings create \
  --service=dictapp-mhw \
  --domain=tu-dominio.com \
  --region=us-central1
```

## 🐛 Solución de Problemas

### Error: "Service not found"
```bash
# Verificar que el servicio existe
gcloud run services list --region=us-central1
```

### Error: "Build failed"
```bash
# Ver logs detallados del build
gcloud builds list --limit=1
gcloud builds logs [BUILD-ID]
```

### Error: "Port not available"
- Asegúrate de que la aplicación escuche en el puerto especificado por `$PORT`
- Cloud Run asigna automáticamente la variable `PORT`

### WebSockets no funcionan
- Cloud Run soporta WebSockets desde 2021
- Asegúrate de usar `allow_unsafe_werkzeug=True` en producción

## 📊 Monitoreo

### Métricas en Cloud Console
- Requests por minuto
- Latencia promedio
- Errores 4xx/5xx
- Uso de CPU y memoria

### Alertas recomendadas
```bash
# Crear alerta por errores
gcloud alpha monitoring policies create --policy-from-file=alert-policy.yaml
```

## 🔄 CI/CD (Opcional)

### GitHub Actions
Crea `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloud Run
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: google-github-actions/setup-gcloud@v0
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        project_id: ${{ secrets.GCP_PROJECT }}
    - run: gcloud run deploy --source .
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `gcloud run services logs tail dictapp-mhw`
2. Verifica la configuración: `gcloud run services describe dictapp-mhw`
3. Consulta la [documentación oficial](https://cloud.google.com/run/docs)

**¡Tu aplicación está lista para el mundo! 🌍**