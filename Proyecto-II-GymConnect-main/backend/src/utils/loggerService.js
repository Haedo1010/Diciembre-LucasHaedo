import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGS_DIR = path.join(__dirname, '../../logs');

// Crear directorio de logs si no existe
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Niveles de severidad
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class LoggerService {
  constructor(nombreModulo = 'GENERAL') {
    this.nombreModulo = nombreModulo;
    this.nivelActual = process.env.LOG_LEVEL || 'DEBUG';
  }

  /**
   * Obtener archivo de log del día
   */
  static obtenerArchivoDelDia() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const nombreArchivo = `log_${año}-${mes}-${dia}.txt`;
    return path.join(LOGS_DIR, nombreArchivo);
  }

  /**
   * Escribir en archivo de log
   */
  static escribirEnArchivo(contenido) {
    const archivo = this.obtenerArchivoDelDia();
    try {
      fs.appendFileSync(archivo, contenido + '\n', 'utf8');
    } catch (error) {
      console.error('Error escribiendo en archivo de log:', error.message);
    }
  }

  /**
   * Formatear mensaje de log
   */
  static formatearMensaje(nivel, modulo, mensaje, datos = null) {
    const timestamp = new Date().toISOString();
    let linea = `[${timestamp}] [${nivel}] [${modulo}] ${mensaje}`;

    if (datos) {
      linea += `\n  Datos: ${JSON.stringify(datos, null, 2)}`;
    }

    return linea;
  }

  /**
   * DEBUG: Información de depuración
   */
  debug(mensaje, datos = null) {
    const linea = LoggerService.formatearMensaje('DEBUG', this.nombreModulo, mensaje, datos);
    console.log(`🐛 ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * INFO: Información general
   */
  info(mensaje, datos = null) {
    const linea = LoggerService.formatearMensaje('INFO', this.nombreModulo, mensaje, datos);
    console.log(`ℹ️  ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * WARN: Advertencias
   */
  warn(mensaje, datos = null) {
    const linea = LoggerService.formatearMensaje('WARN', this.nombreModulo, mensaje, datos);
    console.warn(`⚠️  ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * ERROR: Errores
   */
  error(mensaje, datos = null) {
    const linea = LoggerService.formatearMensaje('ERROR', this.nombreModulo, mensaje, datos);
    console.error(`❌ ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * Log de acceso a usuario
   */
  static registrarAccesoUsuario(usuarioId, email, accion, ip, detalles = null) {
    const linea = LoggerService.formatearMensaje(
      'ACCESO_USUARIO',
      'AUTH',
      `Usuario ${usuarioId} (${email}) - Acción: ${accion}`,
      { ip, detalles, timestamp: new Date().toISOString() }
    );
    console.log(`🔐 ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * Log de cambio en BD
   */
  static registrarCambioBD(modelo, accion, id, cambios = null) {
    const linea = LoggerService.formatearMensaje(
      'CAMBIO_BD',
      modelo,
      `${accion} (ID: ${id})`,
      cambios
    );
    console.log(`💾 ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * Log de encriptación
   */
  static registrarEncriptacion(tipo, campo, encriptado = true) {
    const linea = LoggerService.formatearMensaje(
      'ENCRIPTACION',
      'SECURITY',
      `${tipo} - Campo: ${campo} - ${encriptado ? 'Encriptado' : 'Desencriptado'}`
    );
    console.log(`🔐 ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * Log de error de seguridad
   */
  static registrarErrorSeguridad(tipo, descripcion, detalles = null) {
    const linea = LoggerService.formatearMensaje(
      'ERROR_SEGURIDAD',
      'SECURITY',
      `${tipo}: ${descripcion}`,
      detalles
    );
    console.error(`🚨 ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * Log de validación
   */
  static registrarValidacion(tipoValidacion, resultado, detalles = null) {
    const linea = LoggerService.formatearMensaje(
      resultado ? 'VALIDACION_OK' : 'VALIDACION_FAIL',
      'VALIDATION',
      `${tipoValidacion}`,
      detalles
    );
    console.log(`${resultado ? '✓' : '✗'} ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * Log de API request
   */
  static registrarRequestAPI(metodo, ruta, statusCode, usuarioId = null, ip = null) {
    const linea = LoggerService.formatearMensaje(
      'API_REQUEST',
      'HTTP',
      `${metodo} ${ruta} - Status: ${statusCode}`,
      { usuarioId, ip }
    );
    console.log(`📡 ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * Log de respaldo/backup
   */
  static registrarBackup(tipo, estado, detalles = null) {
    const linea = LoggerService.formatearMensaje(
      'BACKUP',
      'SYSTEM',
      `${tipo} - Estado: ${estado}`,
      detalles
    );
    console.log(`💾 ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * Log de inicio del servidor
   */
  static registrarInicioServidor(puerto, environment) {
    const linea = LoggerService.formatearMensaje(
      'SERVIDOR_INICIO',
      'SYSTEM',
      `Servidor iniciado en puerto ${puerto} - Environment: ${environment}`
    );
    console.log(`🚀 ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * Log de apagado del servidor
   */
  static registrarApagadoServidor(razon = 'Normal') {
    const linea = LoggerService.formatearMensaje(
      'SERVIDOR_APAGADO',
      'SYSTEM',
      `Servidor apagado - Razón: ${razon}`
    );
    console.log(`🛑 ${linea}`);
    LoggerService.escribirEnArchivo(linea);
  }

  /**
   * Obtener estadísticas de logs del día
   */
  static obtenerEstadisticasDelDia() {
    const archivo = this.obtenerArchivoDelDia();
    
    if (!fs.existsSync(archivo)) {
      return null;
    }

    const contenido = fs.readFileSync(archivo, 'utf8');
    const lineas = contenido.split('\n').filter(l => l.trim());

    const estadisticas = {
      totalRegistros: lineas.length,
      debug: lineas.filter(l => l.includes('[DEBUG]')).length,
      info: lineas.filter(l => l.includes('[INFO]')).length,
      warn: lineas.filter(l => l.includes('[WARN]')).length,
      error: lineas.filter(l => l.includes('[ERROR]')).length,
      accesoUsuarios: lineas.filter(l => l.includes('[ACCESO_USUARIO]')).length,
      cambiosBD: lineas.filter(l => l.includes('[CAMBIO_BD]')).length,
      apiRequests: lineas.filter(l => l.includes('[API_REQUEST]')).length,
      archivos: fs.readdirSync(LOGS_DIR).length
    };

    return estadisticas;
  }

  /**
   * Limpiar logs antiguos (más de 30 días)
   */
  static limpiarLogsAntiguos(diasRetener = 30) {
    try {
      const archivos = fs.readdirSync(LOGS_DIR);
      const ahora = Date.now();
      const diasMs = diasRetener * 24 * 60 * 60 * 1000;

      let eliminados = 0;

      for (const archivo of archivos) {
        const rutaCompleta = path.join(LOGS_DIR, archivo);
        const stats = fs.statSync(rutaCompleta);
        const edad = ahora - stats.mtime.getTime();

        if (edad > diasMs) {
          fs.unlinkSync(rutaCompleta);
          eliminados++;
        }
      }

      if (eliminados > 0) {
        const logger = new LoggerService('SYSTEM');
        logger.info(`Se eliminaron ${eliminados} archivos de log antiguos (>30 días)`);
      }

      return eliminados;
    } catch (error) {
      console.error('Error limpiando logs antiguos:', error.message);
      return 0;
    }
  }

  /**
   * Obtener directorio de logs
   */
  static obtenerDirectorioLogs() {
    return LOGS_DIR;
  }

  /**
   * Obtener último archivo de log
   */
  static obtenerUltimoLog() {
    return this.obtenerArchivoDelDia();
  }
}

export default LoggerService;
