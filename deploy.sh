#!/bin/bash

# Script para desplegar Dicta App en Cloud Run (Tier Gratuito)
# 
# TIER GRATUITO DE CLOUD RUN:
# - 2 millones de requests por mes
# - 360,000 GB-segundos de CPU por mes  
# - 180,000 vCPU-segundos por mes
# - Sin costo adicional hasta estos límites

echo "🚀 Desplegando Dicta App en Cloud Run (Tier Gratuito)..."

gcloud run deploy dictapp-mhw \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --platform managed \
  --memory 512Mi \
  --cpu 1 \7
  --concurrency 80 \
  --max-instances 10 \
  --min-instances 0 \
  --cpu-throttling \
  --execution-environment gen2 \
  --port 8080 \
  --set-env-vars "FLASK_ENV=production" \
  --quiet

echo "✅ ¡Despliegue completado!"
echo "📱 Tu app estará disponible en la URL que aparece arriba"
echo "💰 Configuración optimizada para TIER GRATUITO"