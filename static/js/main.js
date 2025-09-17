document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Vistas
    const initialView = document.getElementById('initial-view');
    const hostView = document.getElementById('host-view');
    const clientView = document.getElementById('client-view');
    const joinForm = document.getElementById('join-form');
    const displayArea = document.getElementById('display-area');

    // Botones
    const startBtn = document.getElementById('start-btn');
    const joinBtnInitial = document.getElementById('join-btn-initial');
    const joinSubmitBtn = document.getElementById('join-submit-btn');
    const copyBtn = document.getElementById('copy-btn');

    // Entradas y Salidas
    const codeInput = document.getElementById('code-input');
    const sessionCodeSpan = document.getElementById('session-code');
    const textInput = document.getElementById('text-input');
    const outputText = document.getElementById('output-text');
    const statusP = document.getElementById('status');

    let sessionCode = null;

    // --- Manejadores de eventos de UI ---

    startBtn.addEventListener('click', () => {
        socket.emit('start_session');
        initialView.classList.add('hidden');
        hostView.classList.remove('hidden');
    });

    joinBtnInitial.addEventListener('click', () => {
        initialView.classList.add('hidden');
        clientView.classList.remove('hidden');
        joinForm.classList.remove('hidden');
        displayArea.classList.add('hidden');
    });

    joinSubmitBtn.addEventListener('click', () => {
        const code = codeInput.value.trim();
        if (code.length === 6) {
            socket.emit('join_session', { code });
        } else {
            alert('El código debe tener 6 dígitos.');
        }
    });

    textInput.addEventListener('input', () => {
        if (sessionCode) {
            socket.emit('text_update', {
                code: sessionCode,
                text: textInput.value
            });
        }
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputText.innerText)
            .then(() => {
                copyBtn.innerText = '¡Copiado!';
                setTimeout(() => {
                    copyBtn.innerText = 'Copiar Texto';
                }, 2000);
            })
            .catch(err => {
                alert('Error al copiar el texto.');
                console.error('Error al copiar:', err);
            });
    });

    // --- Manejadores de eventos de Socket.IO ---

    socket.on('session_created', (data) => {
        sessionCode = data.code;
        sessionCodeSpan.innerText = sessionCode;
    });

    socket.on('client_joined', () => {
        statusP.innerText = '✅ ¡Conectado! Ya puedes empezar a dictar.';
        statusP.style.color = '#28a745';
    });

    socket.on('join_success', () => {
        joinForm.classList.add('hidden');
        displayArea.classList.remove('hidden');
    });

    socket.on('text_updated', (data) => {
        outputText.innerText = data.text;
    });

    socket.on('session_ended', (data) => {
        alert(data.message || 'La sesión ha terminado.');
        window.location.reload();
    });

    socket.on('error', (data) => {
        alert(`Error: ${data.message}`);
    });

});
