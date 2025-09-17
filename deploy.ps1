# Script para desplegar Dicta App en Cloud Run (Tier Gratuito)
# 
# TIER GRATUITO DE CLOUD RUN:
# - 2 millones de requests por mes
# - 360,000 GB-segundos de CPU por mes  
# - 180,000 vCPU-segundos por mes
# - Sin costo adicional hasta estos límites

Write-Host "🚀 Desplegando Dicta App en Cloud Run (Tier Gratuito)..." -ForegroundColor Green

gcloud run deploy dictapp-mhw `
  --source . `
  --region us-central1 `
  --allow-unauthenticated `
  --platform managed `
  --memory 512Mi `
  --cpu 1 `
  --concurrency 80 `
  --max-instances 10 `
  --min-instances 0 `
  --cpu-throttling `
  --execution-environment gen2 `
  --port 8080 `
  --set-env-vars "FLASK_ENV=production" `
  --quiet

Write-Host "✅ ¡Despliegue completado!" -ForegroundColor Green
Write-Host "📱 Tu app estará disponible en la URL que aparece arriba" -ForegroundColor Cyan
Write-Host "💰 Configuración optimizada para TIER GRATUITO" -ForegroundColor Yellow