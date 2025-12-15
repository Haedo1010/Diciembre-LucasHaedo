# Sistema de Validación de Base de Datos - GymConnect

## 📋 Descripción

El sistema valida automáticamente la integridad de la base de datos cada vez que se inicia el servidor. Si se detectan incoherencias, el programa **no se ejecutará** hasta que se resuelvan.

## ✅ Validaciones Realizadas

### 1. **Conexión a la BD**
   - Verifica que la conexión a SQLite sea exitosa
   - Si falla, detiene la ejecución

### 2. **Estructura de Tablas**
   - Comprueba que todas las tablas principales existan:
     - `users` (Usuarios)
     - `roles` (Roles)
     - `classes` (Clases)
     - `products` (Productos)
     - `enrollments` (Inscripciones)
     - `permisos` (Permisos)
     - `rolepermisos` (Relaciones Rol-Permiso)

### 3. **Integridad de Datos**
   - **Usuarios**:
     - ❌ No puede haber usuarios sin rol
     - ❌ El rol debe existir en la tabla de roles
   
   - **Productos**:
     - ⚠️ Advertencia si hay productos sin precio
   
   - **Clases**:
     - ❌ No puede haber clases sin nombre

### 4. **Validación de Relaciones**
   - **Inscripciones**:
     - ⚠️ Advertencia si hay inscripciones sin usuario
     - ⚠️ Advertencia si hay inscripciones sin clase
   
   - **Permisos**:
     - ⚠️ Advertencia si no hay permisos asignados a roles

## 🔴 Errores Críticos vs ⚠️ Advertencias

### Errores Críticos (❌)
Si se encuentran estos problemas, **el servidor NO se inicia**:
- Conexión fallida a la BD
- Tablas faltantes
- Usuarios con rol inválido
- Clases sin nombre

### Advertencias (⚠️)
Se muestran en consola pero **NO detienen** la ejecución:
- Usuarios sin rol asignado
- Productos sin precio
- Inscripciones sin relación
- Permisos no configurados

## 🚀 Cómo Usar

### Validación Automática
La validación se ejecuta automáticamente al iniciar el servidor:

```bash
npm run dev
# o
npm start
```

### Validación Manual
Puedes validar la BD sin iniciar el servidor:

```bash
npm run validate-db
```

## 📊 Salida del Validador

### Ejemplo de Salida Exitosa:
```
🔍 Iniciando validación de base de datos...

✅ Conexión a BD validada

📋 Validando estructura de tablas...
  ✅ Tabla 'users' existe
  ✅ Tabla 'roles' existe
  ✅ Tabla 'classes' existe
  ... (más tablas)

🔐 Validando integridad de datos...
  ✅ Todos los usuarios tienen rol
  ✅ Todos los roles de usuarios son válidos
  ... (más validaciones)

🔗 Validando relaciones...
  ✅ Todas las inscripciones tienen usuario
  ... (más relaciones)

==================================================
✅ BASE DE DATOS VALIDADA CORRECTAMENTE
==================================================
```

### Ejemplo de Salida con Errores:
```
❌ ERRORES ENCONTRADOS:
   ❌ 2 usuario(s) tienen rol inválido
   - Usuario ID 5: rol 'profesor_bloqueado'
   - Usuario ID 8: rol 'unknown'
   ❌ Tabla 'enrollments' no existe

==================================================
No se puede iniciar el servidor con errores en la BD
==================================================
```

## 🔧 Cómo Resolver Errores Comunes

### Error: "Usuarios con rol inválido"
1. Abre la BD con un editor SQLite
2. Verifica que el rol exista en la tabla `roles`
3. Actualiza el usuario con un rol válido:
   ```sql
   UPDATE users SET rol = 'cliente' WHERE id = 5;
   ```

### Error: "Clases sin nombre"
```sql
SELECT * FROM classes WHERE nombre IS NULL;
DELETE FROM classes WHERE nombre IS NULL;
```

### Error: "Tabla no existe"
Las tablas se crean automáticamente al sincronizar Sequelize. Si sigue fallando, elimina `database.sqlite` y reinicia (esto creará una nueva BD vacía).

## 📝 Configuración

El validador está configurado en:
- `src/utils/validateDatabase.js` - Lógica principal
- `scripts/validate_db.mjs` - Script de línea de comandos
- Integrado en `src/server.js` - Validación al startup

## 🔄 Extensiones Futuras

Puedes agregar más validaciones según necesites:

```javascript
async validateCustomRule() {
  // Tu validación personalizada
  const problematicos = await Model.findAll(/* ... */);
  if (problematicos.length > 0) {
    this.errors.push('Tu mensaje de error');
  }
}
```

Luego añádelo en el método `validate()`:
```javascript
await this.validateCustomRule();
```
