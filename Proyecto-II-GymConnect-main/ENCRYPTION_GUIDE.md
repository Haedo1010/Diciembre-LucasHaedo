# Sistema de Encriptación - GymConnect

## 📋 Descripción

Sistema de encriptación bidireccional que maneja dos tipos de datos:

- **🔓 Reversible (AES-256-CBC)**: Datos que necesitan ser leídos/recuperados
  - Emails
  - Códigos de verificación
  - Teléfonos
  - Cualquier dato sensible que requiera acceso

- **🔒 Irreversible (bcrypt)**: Datos que NO deben ser recuperados
  - Contraseñas
  - Datos que se comparan pero no se leen

## 🔧 Componentes

### 1. EncryptionService (`src/utils/encryptionService.js`)

Servicio principal con métodos estáticos para encriptación:

```javascript
// Encriptación reversible
EncryptionService.encryptReversible(texto)      // Encriptar
EncryptionService.decryptReversible(encriptado) // Desencriptar

// Encriptación irreversible
await EncryptionService.hashIrreversible(texto) // Hash
await EncryptionService.compareIrreversible(plano, hash) // Comparar

// Utilities
EncryptionService.generarCodigoVerificacion(6)  // Generar código
EncryptionService.generarTokenSeguro(32)        // Generar token
```

### 2. EncryptionHooks (`src/utils/encryptionHooks.js`)

Hooks automáticos de Sequelize que:
- ✅ Encriptan datos antes de guardar
- ✅ Desencriptan datos después de consultar
- ✅ Manejan actualizaciones
- ✅ No requieren cambios en las rutas

## 🚀 Uso

### En Modelos

```javascript
import { createEncryptionHooks } from '../utils/encryptionHooks.js';

// Aplicar encriptación a ciertos campos
createEncryptionHooks(User, ['email', 'verificationCode', 'telefono']);
```

### En Rutas (Sin cambios necesarios!)

Gracias a los hooks, el código continúa igual:

```javascript
// El email se encripta automáticamente al guardar
const usuario = await User.create({
  nombre: 'Juan',
  email: 'juan@example.com',  // Se encripta automáticamente
  password: hashedPassword
});

// El email se desencripta automáticamente al consultar
const usuarioConsultado = await User.findByPk(1);
console.log(usuarioConsultado.email); // Muestra: juan@example.com (desencriptado)
```

## 🔐 Seguridad

### Clave de Encriptación

```javascript
// En .env
ENCRYPTION_KEY=gymnasium-secret-key-32-chars-long!

// Usada para derivar clave AES-256
const derivedKey = crypto
  .createHash('sha256')
  .update(ENCRYPTION_KEY)
  .digest();
```

**IMPORTANTE**: Protege la `ENCRYPTION_KEY` como si fuera una contraseña maestra.

### Algoritmos

| Tipo | Algoritmo | Uso | Reversible |
|------|-----------|-----|-----------|
| Reversible | AES-256-CBC | Emails, códigos, teléfonos | ✅ Sí |
| Irreversible | bcrypt | Contraseñas | ❌ No |
| IV (Initialization Vector) | Random 16 bytes | Cada encriptación | Único |

### Formato de Datos Encriptados

```
Reversible:  "hexiv:hexencrypted"
Ejemplo:     "a1b2c3d4e5f6g7h8:9i0j1k2l3m4n5o6p7"

Irreversible: "$2b$10$..." (bcrypt hash)
Ejemplo:      "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YFSM"
```

## 📊 Campos Encriptados por Defecto

En el modelo `User`:
- ✅ `email` - Encriptación reversible
- ✅ `verificationCode` - Encriptación reversible
- ✅ `telefono` - Encriptación reversible
- ✅ `password` - Hash irreversible (bcrypt)

## 🔄 Migración de Datos Existentes

Para encriptar datos existentes en la BD:

```bash
npm run migrate-encryption
```

El script:
1. Conecta a la BD
2. Busca usuarios con datos sin encriptar
3. Encripta email, código de verificación y teléfono
4. Actualiza la BD
5. Muestra reporte detallado

**Ejemplo de salida:**

```
╔════════════════════════════════════════════╗
║   MIGRACIÓN A ENCRIPTACIÓN                ║
╚════════════════════════════════════════════╝

✅ Conectado a la BD

📊 Total de usuarios a procesar: 45

   Encriptando email de usuario 1...
   Encriptando código de verificación de usuario 1...
   ✅ Usuario 1 actualizado

   [... más usuarios ...]

╔════════════════════════════════════════════╗
║         RESUMEN DE MIGRACIÓN              ║
╚════════════════════════════════════════════╝

✅ Usuarios encriptados:  45
⊘  Usuarios saltados:     0
❌ Errores:               0
📊 Total procesados:      45

╔════════════════════════════════════════════╗
║  ✅ MIGRACIÓN COMPLETADA EXITOSAMENTE    ║
╚════════════════════════════════════════════╝
```

## 💻 Ejemplos de Uso

### Crear Usuario con Encriptación Automática

```javascript
const usuario = await User.create({
  nombre: 'Ana García',
  email: 'ana@gmail.com',        // ← Se encripta automáticamente
  password: await bcrypt.hash('securepass', 10),
  verificationCode: 'ABC123',    // ← Se encripta automáticamente
  telefono: '+34 600 123 456'    // ← Se encripta automáticamente
});
```

En la BD se guarda:
```
email: "a1b2c3d4:9i0j1k2l3m4n5o6p7"
verificationCode: "b5c6d7e8:1p2q3r4s5t6u7v8w9"
telefono: "c9d0e1f2:2x3y4z5a6b7c8d9e0f"
```

### Consultar Usuario (Desencriptación Automática)

```javascript
const usuario = await User.findByPk(1);

// Los datos se desencriptan automáticamente en el hook afterFind
console.log(usuario.email);             // ana@gmail.com
console.log(usuario.verificationCode);  // ABC123
console.log(usuario.telefono);          // +34 600 123 456
```

### Usar EncryptionService Directamente

```javascript
import EncryptionService from './utils/encryptionService.js';

// Encriptar/Desencriptar manualmente
const encriptado = EncryptionService.encryptReversible('dato sensible');
const original = EncryptionService.decryptReversible(encriptado);

// Generar códigos seguros
const codigo = EncryptionService.generarCodigoVerificacion(6);   // "A1B2C3"
const token = EncryptionService.generarTokenSeguro(32);         // "a1b2c3..."
```

## ⚙️ Configuración

### Variables de Entorno

```env
# .env
ENCRYPTION_KEY=tu-clave-secreta-de-32-caracteres-minimo!
NODE_ENV=production
```

### Agregar Encriptación a Otros Modelos

```javascript
import { createEncryptionHooks } from '../utils/encryptionHooks.js';

// En tu modelo
createEncryptionHooks(MiModelo, ['campo1', 'campo2', 'campo3']);
```

## 🔍 Verificación de Integridad

El sistema genera un IV (Initialization Vector) aleatorio para cada encriptación:

```
Misma entrada, diferentes resultados:
"juan@example.com" → "a1b2c3:9i0j1k2l..."
"juan@example.com" → "d4e5f6:3m4n5o6p..." ✓ IV diferente
"juan@example.com" → "g7h8i9:7q8r9s0t..." ✓ IV diferente

Todos se desencriptan a: "juan@example.com"
```

Esto proporciona **seguridad contra ataques de patrón**.

## 🚨 Problemas Comunes

### "Formato de encriptación inválido"

**Causa**: Intentar desencriptar un dato que no está en formato `iv:encrypted`

**Solución**: Verificar que el dato está encriptado

```javascript
// ❌ Incorrecto
EncryptionService.decryptReversible('datos_sin_encriptar');

// ✅ Correcto
EncryptionService.decryptReversible('a1b2c3d4:9i0j1k2l...');
```

### Datos aparecen como null después de desencriptar

**Causa**: ENCRYPTION_KEY cambió o está incorrecta

**Solución**: Asegurate que ENCRYPTION_KEY sea la misma en .env

### Encriptación es lenta

**Causa**: Normal - AES-256 requiere procesamiento

**Solución**: Encriptar solo campos sensibles, no todo

## 📈 Rendimiento

- **Encriptación reversible**: ~0.1-0.5ms por campo
- **Hash irreversible**: ~50-100ms (bcrypt)
- **Desencriptación**: ~0.1-0.5ms por campo

El impacto es minimal para operaciones normales.

## 🔄 Backup de Datos Encriptados

Los backups incluyen datos encriptados. Para restaurar:

1. Usar `npm run restore-backup`
2. Los datos se desencriptan automáticamente con los hooks
3. Asegurar que ENCRYPTION_KEY sea la misma

## 🛡️ Checklist de Seguridad

- [x] Usar ENCRYPTION_KEY fuerte (32+ caracteres)
- [x] Almacenar ENCRYPTION_KEY en variables de entorno (.env)
- [x] No compartir ENCRYPTION_KEY en el repositorio
- [x] Usar HTTPS en producción
- [x] Rotar ENCRYPTION_KEY periódicamente
- [x] Hacer backups encriptados
- [x] Monitorear accesos a datos sensibles

## 📝 Cambios en la Base de Datos

Después de encriptación, los campos afectados contendrán:

```sql
-- ANTES
SELECT email FROM users;
juan@example.com
maria@gmail.com

-- DESPUÉS (ejecutar migrate-encryption)
SELECT email FROM users;
a1b2c3d4e5f6:9i0j1k2l3m4n5o6p7
b5c6d7e8f9g0:1p2q3r4s5t6u7v8w9
```

Pero al consultar desde Node.js, se desencriptan automáticamente.

---

**Última actualización**: Diciembre 15, 2025
