#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.URL);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../database.sqlite');
const BACKUP_DIR = path.join(__dirname, '../backups');
const NUM_PARTITIONS = 3;

async function restoreBackupFromPartitions() {
  try {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  RESTAURAR BACKUP PARTICIONADO            ║');
    console.log('╚════════════════════════════════════════════╝\n');

    // Buscar la carpeta de backup más reciente
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

    const latestBackup = folders[0];
    const backupPath = path.join(BACKUP_DIR, latestBackup);

    console.log(`📁 Usando backup: ${latestBackup}\n`);

    // Verificar metadata
    const metadataPath = path.join(backupPath, 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      throw new Error('No se encontró metadata.json en el backup');
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

    console.log('📋 Información del backup:');
    console.log(`   Fecha: ${metadata.timestamp}`);
    console.log(`   Tamaño original: ${(metadata.originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Particiones: ${metadata.partitions}`);
    console.log(`   Checksum: ${metadata.checksum}\n`);

    // Verificar que todas las particiones existan
    console.log('🔍 Verificando particiones...\n');
    const partitions = [];

    for (let i = 1; i <= NUM_PARTITIONS; i++) {
      const partPath = path.join(backupPath, `part${i}.sqlite`);
      if (!fs.existsSync(partPath)) {
        throw new Error(`Partición part${i}.sqlite no encontrada`);
      }

      const partSize = fs.statSync(partPath).size;
      partitions.push(fs.readFileSync(partPath));
      console.log(`   ✅ Partición ${i}/${NUM_PARTITIONS}: ${(partSize / 1024).toFixed(2)} KB`);
    }

    // Fusionar particiones
    console.log('\n🔀 Fusionando particiones...\n');
    const fullBuffer = Buffer.concat(partitions);

    console.log(`   ✅ Archivo fusionado: ${(fullBuffer.length / 1024).toFixed(2)} KB`);

    // Verificar checksum
    const calculatedChecksum = generateChecksum(fullBuffer);
    if (calculatedChecksum !== metadata.checksum) {
      console.log('\n⚠️  ADVERTENCIA: El checksum no coincide');
      console.log(`   Esperado: ${metadata.checksum}`);
      console.log(`   Calculado: ${calculatedChecksum}`);
      console.log('   El archivo podría estar corrupto\n');
    } else {
      console.log(`   ✅ Checksum verificado: ${calculatedChecksum}\n`);
    }

    // Crear backup del archivo actual (si existe)
    if (fs.existsSync(DB_PATH)) {
      const backupCurrentPath = DB_PATH + '.bak';
      fs.copyFileSync(DB_PATH, backupCurrentPath);
      console.log(`   ✅ Archivo actual respaldado: database.sqlite.bak\n`);
    }

    // Escribir archivo restaurado
    console.log('💾 Escribiendo base de datos...\n');
    fs.writeFileSync(DB_PATH, fullBuffer);
    console.log(`   ✅ Base de datos restaurada: database.sqlite\n`);

    console.log('╔════════════════════════════════════════════╗');
    console.log('║  ✅ RESTAURACIÓN COMPLETADA              ║');
    console.log('╚════════════════════════════════════════════╝\n');

    return true;

  } catch (error) {
    console.error('\n❌ Error en restauración:', error.message);
    console.error('\nPasos para restaurar manualmente:');
    console.error('1. Coloca part1.sqlite, part2.sqlite y part3.sqlite en backend/');
    console.error('2. Verifica que metadata.json esté presente');
    console.error('3. Intenta ejecutar el script nuevamente\n');
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
const success = await restoreBackupFromPartitions();
process.exit(success ? 0 : 1);
