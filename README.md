# 🎤 Dicta App

[![Deploy](https://github.com/user/dicta-app-mobile/actions/workflows/deploy.yml/badge.svg)](https://github.com/user/dicta-app-mobile/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)

> **Convierte tu voz en texto en tiempo real entre dispositivos** 📱➡️💻

Dicta App es una aplicación web moderna que permite transcribir texto desde un celular a una computadora en tiempo real usando WebSockets. Perfecta para dictar documentos, notas, emails y más sin necesidad de teclear.

## ✨ Características

- 🎙️ **Dictado en tiempo real** - Transcripción instantánea entre dispositivos
- 🔒 **Conexión segura** - Códigos únicos de 6 dígitos para emparejar dispositivos
- 📱 **Cross-platform** - Funciona en cualquier navegador (móvil/desktop)
- 🌐 **Sin instalación** - Solo necesitas un navegador web
- ⚡ **Baja latencia** - WebSockets para comunicación ultrarrápida
- 🆓 **Totalmente gratuito** - Desplegado en Google Cloud Run (tier gratuito)

## 🚀 Demo en Vivo

**Prueba la aplicación:** [https://dictapp-mhw-738906282376.us-central1.run.app](https://dictapp-mhw-738906282376.us-central1.run.app)

### Cómo usar:
1. **Celular**: Abre la app y selecciona "🎤 Iniciar Dictado"
2. **PC**: Abre la app y selecciona "💻 Recibir Texto" 
3. **Conectar**: Ingresa el código de 6 dígitos en la PC
4. **¡Dictar!**: Habla en el celular y ve el texto aparecer en la PC

## 🛠️ Tecnologías

- **Backend**: Flask + Socket.IO (Python 3.11+)
- **Frontend**: HTML5 + CSS3 + JavaScript
- **WebSockets**: Comunicación en tiempo real
- **Deployment**: Google Cloud Run
- **Containerización**: Docker

## 🏃‍♂️ Inicio Rápido

### Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/dicta-app-mobile.git
cd dicta-app-mobile

# 2. Crear entorno virtual
python -m venv venv

# 3. Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Ejecutar aplicación
python app.py
```

La aplicación estará disponible en `http://localhost:5000`

### 🐳 Docker

```bash
# Construir imagen
docker build -t dicta-app .

# Ejecutar contenedor
docker run -p 8080:8080 dicta-app
```

### ☁️ Desplegar en Google Cloud Run

Ver guía completa en [DEPLOY.md](./DEPLOY.md)

```bash
# Despliegue rápido
gcloud run deploy dictapp --source . --region us-central1 --allow-unauthenticated
```

## 📁 Estructura del Proyecto

```
dicta-app-mobile/
├── app.py                 # Aplicación Flask principal
├── requirements.txt       # Dependencias Python
├── Dockerfile            # Configuración Docker
├── README.md             # Este archivo
├── DEPLOY.md             # Guía de despliegue
├── deploy.sh             # Script de despliegue (Linux/Mac)
├── deploy.ps1            # Script de despliegue (Windows)
├── static/               # Archivos estáticos (CSS, JS)
│   ├── css/
│   └── js/
└── templates/            # Templates HTML
    └── index.html
```

## 🔧 API y Eventos WebSocket

### Eventos del Cliente
- `connect` - Conexión establecida
- `start_session` - Iniciar nueva sesión (celular)
- `join_session` - Unirse a sesión existente (PC)
- `text_update` - Enviar texto actualizado

### Eventos del Servidor
- `session_created` - Sesión creada exitosamente
- `join_success` - Conexión a sesión exitosa
- `text_updated` - Texto recibido y actualizado
- `session_ended` - Sesión terminada
- `error` - Error en la operación

## 🎯 Casos de Uso

- 📝 **Dictado de documentos** - Escribe emails, reportes, artículos
- 🎓 **Notas de estudio** - Transcribe clases y conferencias  
- 💼 **Reuniones remotas** - Captura notas de juntas
- ♿ **Accesibilidad** - Para personas con dificultades para teclear
- 📱 **Productividad móvil** - Dicta mientras caminas o viajas

## 🤝 Contribuir

Las contribuciones son bienvenidas! 

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 🐛 Reportar Bugs

Por favor usa [GitHub Issues](https://github.com/tu-usuario/dicta-app-mobile/issues) para reportar bugs.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 👏 Reconocimientos

- [Flask](https://flask.palletsprojects.com/) - Framework web
- [Socket.IO](https://socket.io/) - WebSockets en tiempo real
- [Google Cloud Run](https://cloud.google.com/run) - Hosting serverless
- Inspirado en la necesidad de dictado remoto durante el trabajo desde casa

## 📞 Soporte

- 📧 Email: tu-email@ejemplo.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/dicta-app-mobile/issues)
- 📚 Docs: [DEPLOY.md](./DEPLOY.md)

---

⭐ **Si este proyecto te fue útil, dale una estrella en GitHub!** ⭐
