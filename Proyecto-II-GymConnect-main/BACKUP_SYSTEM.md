# Sistema de Backup Particionado - GymConnect

## 📋 Descripción

Sistema de backup que divide la base de datos en **3 particiones iguales** para facilitar:
- ✅ Transferencia de archivos grandes
- ✅ Almacenamiento en múltiples ubicaciones
- ✅ Validación de integridad con checksums
- ✅ Restauración simple y rápida

## 🔧 Cómo Usar

### Crear Backup Particionado

```bash
npm run backup
```

**Salida esperada:**
```
╔════════════════════════════════════════════╗
║  BACKUP PARTICIONADO - GYMCONNECT         ║
╚════════════════════════════════════════════╝

📊 Información del archivo:
   Archivo: database.sqlite
   Tamaño: 256.50 KB
   Particiones: 3

📐 Tamaño por partición: 85.50 KB

✂️  Dividiendo archivo en particiones...

   ✅ Partición 1/3: 85.50 KB
   ✅ Partición 2/3: 85.50 KB
   ✅ Partición 3/3: 85.50 KB

📝 Metadata creado: metadata.json
   Checksum: A1B2C3D4

╔════════════════════════════════════════════╗
║  ✅ BACKUP COMPLETADO EXITOSAMENTE       ║
╚════════════════════════════════════════════╝

📁 Ubicación: backups/backup_2025-12-15T10-30-45-123Z/

📦 Archivos generados:
   ✅ part1.sqlite
   ✅ part2.sqlite
   ✅ part3.sqlite
   ✅ metadata.json
   ✅ README.txt
```

### Restaurar desde Backup Particionado

```bash
npm run restore-backup
```

El script automáticamente:
1. Busca el backup más reciente
2. Verifica las particiones
3. Calcula y valida el checksum
4. Respalda el archivo actual (database.sqlite.bak)
5. Fusiona las particiones
6. Restaura la base de datos

## 📁 Estructura de Carpetas

Después de hacer backup, la estructura será:

```
backend/
├── database.sqlite (archivo original)
├── database.sqlite.bak (backup anterior)
├── backups/
│   └── backup_2025-12-15T10-30-45-123Z/
│       ├── part1.sqlite
│       ├── part2.sqlite
│       ├── part3.sqlite
│       ├── metadata.json
│       └── README.txt
├── scripts/
│   ├── backup_partitioned.mjs
│   ├── restore_backup.mjs
│   └── ...
```

## 📝 Contenido del Metadata

Cada backup incluye un archivo `metadata.json`:

```json
{
  "timestamp": "2025-12-15T10:30:45.123Z",
  "originalFile": "database.sqlite",
  "originalSize": 262144,
  "partitions": 3,
  "partitionSizes": [
    { "numero": 1, "tamaño": 87381 },
    { "numero": 2, "tamaño": 87381 },
    { "numero": 3, "tamaño": 87382 }
  ],
  "checksum": "A1B2C3D4"
}
```

## ✅ Validación de Integridad

El sistema utiliza **checksums** para verificar la integridad:

- **Al crear backup**: Genera checksum del archivo original
- **Al restaurar**: Calcula checksum del archivo fusionado
- Si coinciden ✅: El archivo está íntegro
- Si no coinciden ⚠️: Puede haber corrupción

## 🔄 Casos de Uso

### 1. Backup Regular
```bash
npm run backup
# Se crea automáticamente en backups/backup_[timestamp]/
```

### 2. Trasladar Base de Datos a Otra Máquina
```bash
# En máquina 1:
npm run backup

# Copiar las 3 particiones a máquina 2
# En máquina 2:
npm run restore-backup
```

### 3. Distribución en la Nube
- Subir `part1.sqlite` a Google Drive
- Subir `part2.sqlite` a Dropbox
- Subir `part3.sqlite` a OneDrive
- Bajar las 3 partes y ejecutar `npm run restore-backup`

### 4. Recuperación de Desastres
```bash
# Si database.sqlite se corrompe:
npm run restore-backup
# Se restaura automáticamente desde el backup más reciente
```

## ⚙️ Configuración

Para cambiar el número de particiones, edita los archivos:

**backup_partitioned.mjs:**
```javascript
const NUM_PARTITIONS = 3;  // Cambiar este valor
```

**restore_backup.mjs:**
```javascript
const NUM_PARTITIONS = 3;  // Cambiar este valor
```

## 🚨 Solución de Problemas

### Error: "No se encontró la base de datos"
- Asegúrate de estar en el directorio `backend/`
- Verifica que `database.sqlite` existe

### Error: "Checksum no coincide"
- Una o más particiones pueden estar corruptas
- Intenta restaurar desde un backup anterior
- Verifica que los 3 archivos se copiaron correctamente

### Error: "No se encontraron backups"
- Ejecuta primero `npm run backup` para crear uno
- Verifica que la carpeta `backups/` existe

## 📊 Ejemplo Práctico

**Escenario:** Base de datos de 300 MB

```
Archivo original: database.sqlite (300 MB)
         ↓
      Dividir
         ↓
part1.sqlite (100 MB) ─┐
part2.sqlite (100 MB) ─├─→ Guardar en 3 lugares
part3.sqlite (100 MB) ─┘
         ↓
   metadata.json
   (Checksum para validar)
         ↓
   Cuando necesitas restaurar:
         ↓
   Juntar las 3 particiones
         ↓
   Validar checksum
         ↓
   database.sqlite restaurada (300 MB)
```

## 🔐 Seguridad

- ✅ Checksum para detectar corrupción
- ✅ Backup automático del archivo actual
- ✅ Metadata con información de validación
- ✅ README.txt con instrucciones

## 💡 Recomendaciones

1. **Backup Regular**: Ejecuta `npm run backup` después de cambios importantes
2. **Múltiples Ubicaciones**: Guarda las particiones en diferentes lugares
3. **Verificación**: Prueba restaurar periódicamente
4. **Documentación**: Mantén el metadata.json junto con las particiones
5. **Versionado**: Las carpetas usan timestamp para control de versiones

---

**Última actualización:** Diciembre 15, 2025
