# Sistema de Bitácora - GymConnect

## 📋 Descripción

Sistema completo de **bitácora y auditoría** que registra absolutamente todos los eventos del sistema en archivos de log organizados por fecha.

## 🎯 Qué se Registra

### 🔐 Seguridad y Accesos
- ✅ Logins exitosos y fallidos
- ✅ Logouts
- ✅ Accesos a secciones admin
- ✅ Cambios de contraseña
- ✅ Intentos de acceso no autorizado

### 💾 Base de Datos
- ✅ Creación de registros (CREATE)
- ✅ Actualización de registros (UPDATE) - con cambios específicos
- ✅ Eliminación de registros (DELETE)
- ✅ ID de usuario/admin que realizó la acción

### 📡 API y HTTP
- ✅ Todos los requests HTTP (método, ruta, status code)
- ✅ IP del cliente
- ✅ Usuario autenticado
- ✅ Errores HTTP

### 🔒 Encriptación
- ✅ Operaciones de encriptación/desencriptación
- ✅ Campos encriptados
- ✅ Éxito/fallos

### ⚠️ Errores y Alertas
- ✅ Errores de aplicación
- ✅ Errores de BD
- ✅ Advertencias de seguridad
- ✅ Stack traces en desarrollo

### 🚀 Sistema
- ✅ Inicio del servidor
- ✅ Apagado del servidor
- ✅ Validaciones de BD
- ✅ Backups

## 📁 Estructura de Archivos

Los logs se guardan en `backend/logs/`:

```
logs/
├── log_2025-12-15.txt
├── log_2025-12-14.txt
├── log_2025-12-13.txt
└── ...
```

Un archivo **por día** con todos los eventos.

## 🔧 Componentes

### 1. LoggerService (`src/utils/loggerService.js`)

Servicio principal que maneja todo el logging:

```javascript
import LoggerService from './utils/loggerService.js';

// Crear instancia para un módulo
const logger = new LoggerService('MI_MODULO');

// Registrar eventos
logger.debug('Mensaje de debug', datos);
logger.info('Información general', datos);
logger.warn('Advertencia', datos);
logger.error('Error crítico', datos);

// Métodos especializados
LoggerService.registrarAccesoUsuario(id, email, accion, ip);
LoggerService.registrarCambioBD(modelo, accion, id, cambios);
LoggerService.registrarErrorSeguridad(tipo, descripcion);
```

### 2. Middlewares de Logging

**loggingMiddleware**: Registra todos los requests HTTP
- Método y ruta
- Status code
- Usuario (si está autenticado)
- IP del cliente

**errorLoggingMiddleware**: Registra errores HTTP
- Detalles del error
- Stack trace (en desarrollo)
- Usuario y IP

### 3. Hooks de Logging

**loggingHooks**: Registra cambios en la BD
- Qué se creó
- Qué se actualizó
- Qué se eliminó
- Valores anteriores y nuevos

## 🚀 Uso

### Ver Logs

```bash
# Ver estadísticas del día
npm run logs stats

# Ver último log
npm run logs hoy

# Ver últimas 50 líneas
npm run logs tail

# Ver últimas 100 líneas
npm run logs tail 100

# Listar todos los archivos
npm run logs list

# Buscar término en todos los logs
npm run logs buscar "ERROR"

# Limpiar logs > 30 días
npm run logs limpiar 30
```

### Ejemplo de Salida

```
npm run logs stats

╔════════════════════════════════════════════╗
║     ESTADÍSTICAS DE LOGS (HOY)            ║
╚════════════════════════════════════════════╝

📊 Total de registros: 1,247
   🐛 DEBUG: 342
   ℹ️  INFO: 654
   ⚠️  WARN: 187
   ❌ ERROR: 64

🔐 Accesos de usuarios: 45
💾 Cambios en BD: 89
📡 API Requests: 1,150

📁 Total de archivos de log: 15
```

## 📊 Formato de Logs

### Formato Estándar

```
[2025-12-15T14:30:45.123Z] [INFO] [AUTH] Usuario juan@example.com inició sesión
  Datos: {"ip":"192.168.1.100","detalles":{"loginAttempts":0}}
```

### Componentes

- **[TIMESTAMP]** - ISO 8601 con milisegundos
- **[NIVEL]** - DEBUG, INFO, WARN, ERROR, ACCESO_USUARIO, CAMBIO_BD, etc.
- **[MODULO]** - Dónde se registró (AUTH, ADMIN, USER, SYSTEM, etc.)
- **MENSAJE** - Descripción clara del evento
- **DATOS** - Información adicional (JSON formateado)

## 🔍 Ejemplo de Logs en Acción

### Cuando se crea un usuario:

```
[2025-12-15T14:35:20.456Z] [DEBUG] [USER] Preparando crear nuevo registro
  Datos: {"id":null,"nombre":"Ana García","email":"ana@example.com","rol":"cliente",...}

[2025-12-15T14:35:20.489Z] [CAMBIO_BD] [USER] CREATE (ID: 45)
  Datos: {"nombre":"Ana García","email":"ana@example.com","rol":"cliente",...}

[2025-12-15T14:35:20.523Z] [API_REQUEST] [HTTP] POST /api/auth/register - Status: 201
  Datos: {"usuarioId":45,"ip":"192.168.1.50"}
```

### Cuando hay un error de login:

```
[2025-12-15T14:40:10.234Z] [ACCESO_USUARIO] [AUTH] Usuario error@example.com - Acción: LOGIN_FALLIDO
  Datos: {"ip":"192.168.1.75","detalles":{"razon":"Contraseña incorrecta","intentos":2}}

[2025-12-15T14:40:10.267Z] [ERROR_SEGURIDAD] [SECURITY] LOGIN_FALLIDO: 3 intentos fallidos
  Datos: {"usuarioId":null,"email":"error@example.com","ip":"192.168.1.75"}
```

### Cuando se encripta un email:

```
[2025-12-15T14:42:35.111Z] [ENCRIPTACION] [SECURITY] CREATE - Campo: email - Encriptado
[2025-12-15T14:42:35.145Z] [ENCRIPTACION] [SECURITY] CREATE - Campo: verificationCode - Encriptado
```

## 📈 Búsqueda y Análisis

### Buscar por usuario

```bash
npm run logs buscar "juan@example.com"
```

### Buscar errores

```bash
npm run logs buscar "ERROR"
```

### Buscar cambios en BD

```bash
npm run logs buscar "UPDATE"
```

### Buscar accesos admin

```bash
npm run logs buscar "/admin/"
```

## 🗑️ Limpieza de Logs Antiguos

Los logs se guardan indefinidamente, pero puedes limpiar los antiguos:

```bash
# Eliminar logs > 30 días
npm run logs limpiar 30

# Eliminar logs > 90 días
npm run logs limpiar 90

# Eliminar logs > 7 días
npm run logs limpiar 7
```

## 🔐 Seguridad de Logs

### Lo Que Se Registra

✅ IPs de acceso
✅ Intentos fallidos
✅ Cambios en datos
✅ Errores de validación

### Lo Que NO Se Registra

❌ Contraseñas (nunca)
❌ Tokens JWT (nunca)
❌ Llaves de encriptación (nunca)
❌ Datos encriptados en texto plano

## 📊 Niveles de Log

| Nivel | Uso | Color |
|-------|-----|-------|
| DEBUG | Información de depuración | 🐛 |
| INFO | Eventos normales | ℹ️ |
| WARN | Advertencias | ⚠️ |
| ERROR | Errores | ❌ |
| ACCESO_USUARIO | Accesos/logins | 🔐 |
| CAMBIO_BD | Cambios en BD | 💾 |
| API_REQUEST | Requests HTTP | 📡 |
| ENCRIPTACION | Operaciones criptográficas | 🔐 |
| ERROR_SEGURIDAD | Errores de seguridad | 🚨 |
| VALIDACION | Validaciones | ✓/✗ |
| BACKUP | Operaciones de backup | 💾 |
| SERVIDOR | Inicio/apagado | 🚀/🛑 |

## 💡 Casos de Uso

### Auditoría de Seguridad

```bash
npm run logs buscar "ERROR_SEGURIDAD"
# Ver todos los intentos de acceso no autorizado
```

### Debugging

```bash
npm run logs tail 100
# Ver los últimos 100 eventos
```

### Análisis de Cambios

```bash
npm run logs buscar "UPDATE"
# Ver qué se actualizó en la BD
```

### Investigación de Incidentes

```bash
npm run logs buscar "juan@example.com"
# Ver toda la actividad del usuario
```

## 📝 Ejemplo de Implementación

### En una ruta

```javascript
import LoggerService from '../utils/loggerService.js';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Registrar intento
    LoggerService.registrarAccesoUsuario(
      null,
      email,
      'LOGIN_INTENTO',
      req.ip
    );

    const usuario = await User.findOne({ where: { email } });

    if (!usuario) {
      LoggerService.registrarErrorSeguridad(
        'LOGIN_FALLIDO',
        `Usuario no encontrado: ${email}`,
        { ip: req.ip }
      );
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Login exitoso
    LoggerService.registrarAccesoUsuario(
      usuario.id,
      email,
      'LOGIN_EXITOSO',
      req.ip
    );

    res.json({ token });
  } catch (error) {
    LoggerService.registrarErrorSeguridad(
      'LOGIN_ERROR',
      error.message,
      { email: req.body.email, ip: req.ip }
    );
    res.status(500).json({ error: error.message });
  }
});
```

## 🔄 Rotación de Logs

Los logs se crean automáticamente **por día**:

```
log_2025-12-15.txt  ← Logs del 15 de diciembre
log_2025-12-14.txt  ← Logs del 14 de diciembre
log_2025-12-13.txt  ← Logs del 13 de diciembre
```

No necesita configuración adicional.

## 📊 Monitoreo

### Ver cantidad de logs

```bash
npm run logs list
```

### Ver resumen del día

```bash
npm run logs stats
```

### Monitorear en tiempo real

```bash
npm run logs tail  # Actualizar cada vez que cambien
```

## 🚀 Consideraciones de Rendimiento

- **Impacto mínimo**: Logging asincrónico
- **Almacenamiento**: ~1-5 MB por día (según actividad)
- **Lectura**: Instantánea incluso con 100+ MB de logs

## 📈 Análisis de Datos

Puedes usar herramientas externas para análisis:

```bash
# Contar eventos por tipo
grep "ERROR" logs/*.txt | wc -l

# Ver top 10 de IPs
grep "API_REQUEST" logs/*.txt | grep -oP "\"ip\":\"[^\"]+\"" | sort | uniq -c | sort -rn | head -10

# Ver usuarios más activos
grep "ACCESO_USUARIO" logs/*.txt | grep -oP "Usuario [^ ]+" | sort | uniq -c | sort -rn | head -10
```

## 🛡️ Mejor Práctica

1. **Revisar logs regularmente**: `npm run logs stats` diario
2. **Monitorear errores**: `npm run logs buscar "ERROR"` 
3. **Limpiar antiguos**: `npm run logs limpiar 30` mensualmente
4. **Archivar logs críticos**: Guardar logs de incidentes por separado
5. **Integrar con monitoreo**: Usar herramientas como ELK Stack en producción

---

**Última actualización**: Diciembre 15, 2025
