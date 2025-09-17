import random
import string
from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode='eventlet')

# Usaremos un diccionario en memoria para esta prueba de concepto
# La clave es el código de sesión, el valor contiene los IDs de sesión del host y el cliente
sessions = {}

def generate_session_code():
    """Genera un código único de 6 dígitos."""
    while True:
        code = ''.join(random.choices(string.digits, k=6))
        if code not in sessions:
            return code

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print(f'Cliente conectado: {request.sid}')

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Cliente desconectado: {request.sid}')
    # Buscar la sesión a la que pertenecía el usuario y limpiarla
    session_to_delete = None
    for code, sids in sessions.items():
        if sids['host'] == request.sid or sids['client'] == request.sid:
            # Notificar al otro miembro de la sala que la sesión ha terminado
            if sids['host'] and sids['host'] != request.sid:
                emit('session_ended', {'message': 'El otro usuario se ha desconectado.'}, room=sids['host'])
            if sids['client'] and sids['client'] != request.sid:
                emit('session_ended', {'message': 'El otro usuario se ha desconectado.'}, room=sids['client'])
            
            session_to_delete = code
            break
            
    if session_to_delete:
        del sessions[session_to_delete]
        print(f"Sesión {session_to_delete} eliminada.")


@socketio.on('start_session')
def handle_start_session():
    """Manejador para cuando el celular inicia una nueva sesión de dictado."""
    code = generate_session_code()
    sessions[code] = {'host': request.sid, 'client': None}
    join_room(code)
    emit('session_created', {'code': code})
    print(f"Sesión {code} creada por host {request.sid}")

@socketio.on('join_session')
def handle_join_session(data):
    """Manejador para cuando la computadora se une a una sesión existente."""
    code = data.get('code')
    if not code or code not in sessions:
        emit('error', {'message': 'El código de sesión no es válido.'})
        return

    session = sessions[code]
    if session['client'] is not None:
        emit('error', {'message': 'Esta sesión ya está en uso.'})
        return

    session['client'] = request.sid
    join_room(code)
    
    # Notificar al que se une que fue exitoso
    emit('join_success')
    # Notificar al host que el cliente se ha unido
    emit('client_joined', room=session['host'])
    print(f"Cliente {request.sid} se unió a la sesión {code}")


@socketio.on('text_update')
def handle_text_update(data):
    """Recibe texto del host (celular) y lo transmite al cliente (computadora)."""
    code = data.get('code')
    text = data.get('text')
    
    if code in sessions and sessions[code]['host'] == request.sid:
        # Emitir solo al cliente de la sala
        client_sid = sessions[code]['client']
        if client_sid:
            emit('text_updated', {'text': text}, room=client_sid)

@socketio.on('text_clear')
def handle_text_clear(data):
    """Maneja la acción de borrar texto desde el host (celular)."""
    code = data.get('code')
    
    if code in sessions and sessions[code]['host'] == request.sid:
        # Emitir evento de borrado al cliente de la sala
        client_sid = sessions[code]['client']
        if client_sid:
            emit('text_cleared', room=client_sid)

if __name__ == '__main__':
    import os
    # Cloud Run usa PORT env var, local usa 5000
    port = int(os.environ.get('PORT', 5000))
    host = '0.0.0.0'
    
    print(f"Iniciando servidor en {host}:{port}")
    # Configuración optimizada para Cloud Run
    socketio.run(
        app, 
        host=host, 
        port=port, 
        debug=False,
        allow_unsafe_werkzeug=True  # Necesario para Socket.IO en producción
    )
