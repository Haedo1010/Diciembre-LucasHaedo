#!/usr/bin/env node

import sequelize from '../src/config/initbd.js';
import User from '../src/models/User.js';
import EncryptionService from '../src/utils/encryptionService.js';

const migrateToEncryption = async () => {
  try {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║   MIGRACIÓN A ENCRIPTACIÓN                ║');
    console.log('╚════════════════════════════════════════════╝\n');

    await sequelize.authenticate();
    console.log('✅ Conectado a la BD\n');

    // Obtener todos los usuarios
    const usuarios = await User.findAll({
      attributes: ['id', 'email', 'verificationCode', 'telefono'],
      raw: true
    });

    console.log(`📊 Total de usuarios a procesar: ${usuarios.length}\n`);

    let encriptados = 0;
    let saltados = 0;
    let errores = 0;

    for (const usuario of usuarios) {
      try {
        let cambios = false;

        // Encriptar email si no está ya encriptado
        if (usuario.email && !usuario.email.includes(':')) {
          console.log(`   Encriptando email de usuario ${usuario.id}...`);
          usuario.email = EncryptionService.encryptReversible(usuario.email);
          cambios = true;
        }

        // Encriptar código de verificación si existe y no está encriptado
        if (usuario.verificationCode && !usuario.verificationCode.includes(':')) {
          console.log(`   Encriptando código de verificación de usuario ${usuario.id}...`);
          usuario.verificationCode = EncryptionService.encryptReversible(usuario.verificationCode);
          cambios = true;
        }

        // Encriptar teléfono si existe y no está encriptado
        if (usuario.telefono && !usuario.telefono.includes(':')) {
          console.log(`   Encriptando teléfono de usuario ${usuario.id}...`);
          usuario.telefono = EncryptionService.encryptReversible(usuario.telefono);
          cambios = true;
        }

        if (cambios) {
          // Actualizar en BD (sin hooks de encriptación)
          await sequelize.query(
            `UPDATE users SET email = ?, verificationCode = ?, telefono = ? WHERE id = ?`,
            {
              replacements: [usuario.email, usuario.verificationCode, usuario.telefono, usuario.id],
              type: sequelize.QueryTypes.UPDATE
            }
          );
          encriptados++;
          console.log(`   ✅ Usuario ${usuario.id} actualizado\n`);
        } else {
          saltados++;
        }
      } catch (error) {
        errores++;
        console.error(`   ❌ Error con usuario ${usuario.id}: ${error.message}\n`);
      }
    }

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║         RESUMEN DE MIGRACIÓN              ║');
    console.log('╚════════════════════════════════════════════╝\n');

    console.log(`✅ Usuarios encriptados:  ${encriptados}`);
    console.log(`⊘  Usuarios saltados:     ${saltados}`);
    console.log(`❌ Errores:               ${errores}`);
    console.log(`📊 Total procesados:      ${usuarios.length}\n`);

    if (errores === 0) {
      console.log('╔════════════════════════════════════════════╗');
      console.log('║  ✅ MIGRACIÓN COMPLETADA EXITOSAMENTE    ║');
      console.log('╚════════════════════════════════════════════╝\n');
    } else {
      console.log('⚠️  La migración completó con errores\n');
    }

    process.exit(errores > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Error en migración:', error.message);
    process.exit(1);
  }
};

migrateToEncryption();
