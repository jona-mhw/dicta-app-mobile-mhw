/**
 * DICTA APP - Google Apps Script Version
 * 
 * LIMITACIONES TÉCNICAS IMPORTANTES:
 * 1. Google Apps Script NO soporta WebSockets
 * 2. No hay comunicación en tiempo real nativa
 * 3. Timeout máximo de 6 minutos para ejecuciones
 * 
 * ALTERNATIVA IMPLEMENTADA:
 * - Uso de Google Sheets como base de datos temporal
 * - Polling cada 2 segundos para simular tiempo real
 * - Sistema de sesiones basado en códigos únicos
 */

// ID de la hoja de cálculo que actuará como base de datos
// IMPORTANTE: Reemplazar con tu propio Google Sheet ID
const SHEET_ID = 'TU_GOOGLE_SHEET_ID_AQUI';

/**
 * Función principal que maneja las peticiones HTTP
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Incluir archivos CSS y JS en el HTML
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Crear una nueva sesión de dictado
 * @returns {Object} Código de sesión generado
 */
function createSession() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Generar código único de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Verificar que el código no existe
    const data = sheet.getDataRange().getValues();
    const existingCodes = data.map(row => row[0]);
    
    if (existingCodes.includes(code)) {
      return createSession(); // Recursivo si existe
    }
    
    // Crear nueva fila: [codigo, texto, timestamp, host_connected, client_connected]
    const timestamp = new Date().getTime();
    sheet.appendRow([code, '', timestamp, true, false]);
    
    return {
      success: true,
      code: code,
      message: 'Sesión creada exitosamente'
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Error al crear sesión: ' + error.toString()
    };
  }
}

/**
 * Unirse a una sesión existente
 * @param {string} code - Código de la sesión
 * @returns {Object} Resultado de la operación
 */
function joinSession(code) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Buscar la sesión
    for (let i = 1; i < data.length; i++) { // i=1 para saltar header
      if (data[i][0] == code) {
        // Verificar que no haya cliente conectado
        if (data[i][4]) {
          return {
            success: false,
            error: 'Esta sesión ya está en uso'
          };
        }
        
        // Marcar cliente como conectado
        sheet.getRange(i + 1, 5).setValue(true);
        
        return {
          success: true,
          message: 'Conectado exitosamente',
          currentText: data[i][1] || ''
        };
      }
    }
    
    return {
      success: false,
      error: 'Código de sesión no válido'
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Error al unirse: ' + error.toString()
    };
  }
}

/**
 * Actualizar texto en una sesión
 * @param {string} code - Código de la sesión
 * @param {string} text - Nuevo texto
 * @returns {Object} Resultado de la operación
 */
function updateText(code, text) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Buscar la sesión y actualizar texto
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == code) {
        sheet.getRange(i + 1, 2).setValue(text);
        sheet.getRange(i + 1, 3).setValue(new Date().getTime());
        
        return {
          success: true,
          message: 'Texto actualizado'
        };
      }
    }
    
    return {
      success: false,
      error: 'Sesión no encontrada'
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Error al actualizar: ' + error.toString()
    };
  }
}

/**
 * Obtener texto actual de una sesión (para polling)
 * @param {string} code - Código de la sesión
 * @returns {Object} Texto actual y timestamp
 */
function getText(code) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Buscar la sesión
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == code) {
        return {
          success: true,
          text: data[i][1] || '',
          timestamp: data[i][2],
          hostConnected: data[i][3],
          clientConnected: data[i][4]
        };
      }
    }
    
    return {
      success: false,
      error: 'Sesión no encontrada'
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Error al obtener texto: ' + error.toString()
    };
  }
}

/**
 * Borrar texto de una sesión
 * @param {string} code - Código de la sesión
 * @returns {Object} Resultado de la operación
 */
function clearText(code) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Buscar la sesión y limpiar texto
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == code) {
        sheet.getRange(i + 1, 2).setValue('');
        sheet.getRange(i + 1, 3).setValue(new Date().getTime());
        
        return {
          success: true,
          message: 'Texto borrado'
        };
      }
    }
    
    return {
      success: false,
      error: 'Sesión no encontrada'
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Error al borrar: ' + error.toString()
    };
  }
}

/**
 * Desconectar de una sesión
 * @param {string} code - Código de la sesión
 * @param {string} role - 'host' o 'client'
 * @returns {Object} Resultado de la operación
 */
function disconnect(code, role) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Buscar la sesión
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == code) {
        if (role === 'host') {
          sheet.getRange(i + 1, 4).setValue(false); // host_connected = false
        } else if (role === 'client') {
          sheet.getRange(i + 1, 5).setValue(false); // client_connected = false
        }
        
        // Si ambos desconectados, eliminar sesión
        const hostConnected = role === 'host' ? false : data[i][3];
        const clientConnected = role === 'client' ? false : data[i][4];
        
        if (!hostConnected && !clientConnected) {
          sheet.deleteRow(i + 1);
        }
        
        return {
          success: true,
          message: 'Desconectado'
        };
      }
    }
    
    return {
      success: false,
      error: 'Sesión no encontrada'
    };
    
  } catch (error) {
    return {
      success: false,
      error: 'Error al desconectar: ' + error.toString()
    };
  }
}

/**
 * Limpiar sesiones antiguas (más de 1 hora)
 * Función para ejecutar periódicamente
 */
function cleanupOldSessions() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    const data = sheet.getDataRange().getValues();
    const oneHourAgo = new Date().getTime() - (60 * 60 * 1000);
    
    // Recorrer desde abajo hacia arriba para no afectar índices
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][2] < oneHourAgo) {
        sheet.deleteRow(i + 1);
      }
    }
    
    Logger.log('Sesiones antiguas limpiadas');
    
  } catch (error) {
    Logger.log('Error en cleanup: ' + error.toString());
  }
}

/**
 * Configurar triggers automáticos
 * Ejecutar una sola vez para configurar la limpieza automática
 */
function setupTriggers() {
  // Limpiar triggers existentes
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Crear trigger para limpieza cada hora
  ScriptApp.newTrigger('cleanupOldSessions')
    .timeBased()
    .everyHours(1)
    .create();
    
  Logger.log('Triggers configurados');
}