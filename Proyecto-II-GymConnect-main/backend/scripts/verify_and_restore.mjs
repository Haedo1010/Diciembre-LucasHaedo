#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../database.sqlite');
const BACKUP_DIR = path.join(__dirname, '../backups');
const NUM_PARTITIONS = 3;

async function verifyAndRestoreBackup() {
  try {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  VERIFICAR Y RESTAURAR BACKUP             ║');
    console.log('╚════════════════════════════════════════════╝\n');

    // PASO 1: Buscar backups
    console.log('📁 PASO 1: Buscando backups...\n');
    
    if (!fs.existsSync(BACKUP_DIR)) {
      throw new Error('No se encontró directorio de backups');
    }

    const folders = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('backup_'))
      .sort()
      .reverse();

    if (folders.length === 0) {
      throw new Error('No se encontraron backups disponibles');
    }

    console.log(`   ✅ Backups encontrados: ${folders.length}`);
    folders.forEach((f, i) => {
      console.log(`      ${i + 1}. ${f}`);
    });

    const latestBackup = folders[0];
    const backupPath = path.join(BACKUP_DIR, latestBackup);

    console.log(`\n   ✅ Usando backup más reciente: ${latestBackup}\n`);

    // PASO 2: Verificar estructura
    console.log('📋 PASO 2: Verificando estructura del backup...\n');

    const metadataPath = path.join(backupPath, 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      throw new Error('No se encontró metadata.json');
    }
    console.log('   ✅ metadata.json encontrado');

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    console.log(`      Fecha: ${metadata.timestamp}`);
    console.log(`      Tamaño original: ${(metadata.originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`      Particiones: ${metadata.partitions}`);
    console.log(`      Checksum: ${metadata.checksum}\n`);

    // PASO 3: Verificar particiones
    console.log('🔍 PASO 3: Verificando particiones...\n');

    const partitions = [];
    let totalSize = 0;

    for (let i = 1; i <= NUM_PARTITIONS; i++) {
      const partPath = path.join(backupPath, `part${i}.sqlite`);
      
      if (!fs.existsSync(partPath)) {
        throw new Error(`Partición part${i}.sqlite no encontrada`);
      }

      const partSize = fs.statSync(partPath).size;
      const partBuffer = fs.readFileSync(partPath);
      partitions.push(partBuffer);
      totalSize += partSize;

      console.log(`   ✅ part${i}.sqlite encontrado (${(partSize / 1024).toFixed(2)} KB)`);
    }

    console.log(`\n   ✅ Total fusionado: ${(totalSize / 1024).toFixed(2)} KB\n`);

    // PASO 4: Validar checksum
    console.log('🔐 PASO 4: Validando integridad...\n');

    const fullBuffer = Buffer.concat(partitions);
    const calculatedChecksum = generateChecksum(fullBuffer);

    console.log(`   Checksum esperado:  ${metadata.checksum}`);
    console.log(`   Checksum calculado: ${calculatedChecksum}`);

    if (calculatedChecksum !== metadata.checksum) {
      throw new Error(`❌ CHECKSUM NO COINCIDE - El archivo puede estar corrupto`);
    }

    console.log(`   ✅ CHECKSUM VÁLIDO - Integridad confirmada\n`);

    // PASO 5: Resumen y confirmación
    console.log('📊 RESUMEN DEL BACKUP:\n');
    console.log(`   Archivo original: ${metadata.originalFile}`);
    console.log(`   Tamaño: ${(metadata.originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Particiones: ${metadata.partitions}`);
    console.log(`   Estado: ✅ VÁLIDO Y LISTO PARA RESTAURAR\n`);

    // PASO 6: Confirmación
    console.log('⚠️  ADVERTENCIA:\n');
    console.log('   Este proceso:');
    console.log('   1. Resaldará el archivo actual (database.sqlite.bak)');
    console.log('   2. Reemplazará database.sqlite');
    console.log('   3. No se puede deshacer\n');

    // PASO 7: Restaurar
    console.log('💾 PASO 5: Restaurando base de datos...\n');

    // Crear backup del archivo actual (si existe)
    if (fs.existsSync(DB_PATH)) {
      const backupCurrentPath = DB_PATH + '.bak';
      fs.copyFileSync(DB_PATH, backupCurrentPath);
      console.log(`   ✅ Archivo actual respaldado: database.sqlite.bak`);
    }

    // Escribir archivo restaurado
    fs.writeFileSync(DB_PATH, fullBuffer);
    console.log(`   ✅ Base de datos restaurada: database.sqlite\n`);

    // Verificar que se escribió correctamente
    const restoredSize = fs.statSync(DB_PATH).size;
    console.log(`   ✅ Verificación: ${(restoredSize / 1024).toFixed(2)} KB escritos\n`);

    console.log('╔════════════════════════════════════════════╗');
    console.log('║  ✅ RESTAURACIÓN COMPLETADA              ║');
    console.log('╚════════════════════════════════════════════╝\n');

    console.log('📝 Próximos pasos:\n');
    console.log('   1. Reinicia el servidor: npm run dev');
    console.log('   2. El servidor validará la BD automáticamente');
    console.log('   3. Si hay errores, aparecerán en consola\n');

    return true;

  } catch (error) {
    console.error('\n╔════════════════════════════════════════════╗');
    console.error('║  ❌ ERROR EN RESTAURACIÓN                ║');
    console.error('╚════════════════════════════════════════════╝\n');
    console.error(`Error: ${error.message}\n`);

    console.error('🔧 Pasos para resolver:\n');
    console.error('   1. Verifica que existan las carpetas:');
    console.error(`      - ${BACKUP_DIR}`);
    console.error('      - backup_[fecha]/\n');
    
    console.error('   2. Verifica que existan los archivos:');
    console.error('      - part1.sqlite');
    console.error('      - part2.sqlite');
    console.error('      - part3.sqlite');
    console.error('      - metadata.json\n');

    console.error('   3. Si falta algún archivo, recrea el backup:');
    console.error('      npm run backup\n');

    return false;
  }
}

function generateChecksum(buffer) {
  let checksum = 0;
  for (let i = 0; i < buffer.length; i++) {
    checksum = (checksum + buffer[i]) % 0xFFFFFFFF;
  }
  return checksum.toString(16).padStart(8, '0').toUpperCase();
}

// Ejecutar
const success = await verifyAndRestoreBackup();
process.exit(success ? 0 : 1);
