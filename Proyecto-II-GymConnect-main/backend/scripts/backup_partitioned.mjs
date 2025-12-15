#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../database.sqlite');
const BACKUP_DIR = path.join(__dirname, '../backups');
const NUM_PARTITIONS = 3;

// Crear directorio de backups si no existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function createBackupPartitioned() {
  try {
    // Verificar que el archivo BD existe
    if (!fs.existsSync(DB_PATH)) {
      throw new Error(`No se encontró la base de datos en: ${DB_PATH}`);
    }

    const stats = fs.statSync(DB_PATH);
    const fileSize = stats.size;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║  BACKUP PARTICIONADO - GYMCONNECT         ║');
    console.log('╚════════════════════════════════════════════╝\n');

    console.log(`📊 Información del archivo:`);
    console.log(`   Archivo: database.sqlite`);
    console.log(`   Tamaño: ${(fileSize / 1024).toFixed(2)} KB`);
    console.log(`   Particiones: ${NUM_PARTITIONS}\n`);

    // Calcular tamaño de cada partición
    const partitionSize = Math.ceil(fileSize / NUM_PARTITIONS);
    console.log(`📐 Tamaño por partición: ${(partitionSize / 1024).toFixed(2)} KB\n`);

    // Crear carpeta con timestamp para este backup
    const backupFolder = path.join(BACKUP_DIR, `backup_${timestamp}`);
    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder, { recursive: true });
    }

    // Leer archivo BD
    const buffer = fs.readFileSync(DB_PATH);

    // Dividir en particiones
    console.log('✂️  Dividiendo archivo en particiones...\n');

    const partitions = [];
    for (let i = 0; i < NUM_PARTITIONS; i++) {
      const start = i * partitionSize;
      const end = i === NUM_PARTITIONS - 1 ? fileSize : (i + 1) * partitionSize;
      const partition = buffer.slice(start, end);

      const partitionPath = path.join(backupFolder, `part${i + 1}.sqlite`);
      fs.writeFileSync(partitionPath, partition);

      const partSize = partition.length;
      partitions.push({
        numero: i + 1,
        ruta: partitionPath,
        tamaño: partSize
      });

      console.log(`   ✅ Partición ${i + 1}/${NUM_PARTITIONS}: ${(partSize / 1024).toFixed(2)} KB`);
    }

    // Crear archivo de metadata
    const metadata = {
      timestamp: new Date().toISOString(),
      originalFile: 'database.sqlite',
      originalSize: fileSize,
      partitions: NUM_PARTITIONS,
      partitionSizes: partitions.map(p => ({
        numero: p.numero,
        tamaño: p.tamaño
      })),
      checksum: generateChecksum(buffer)
    };

    const metadataPath = path.join(backupFolder, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    console.log(`\n📝 Metadata creado: metadata.json`);
    console.log(`   Checksum: ${metadata.checksum}\n`);

    // Crear archivo README
    const readmePath = path.join(backupFolder, 'README.txt');
    const readmeContent = `BACKUP PARTICIONADO DE GYMCONNECT
====================================

Fecha: ${new Date().toLocaleString()}
Versión: 1.0

CONTENIDO:
- part1.sqlite: Partición 1 de ${NUM_PARTITIONS}
- part2.sqlite: Partición 2 de ${NUM_PARTITIONS}
- part3.sqlite: Partición 3 de ${NUM_PARTITIONS}
- metadata.json: Información del backup

PARA RESTAURAR:
1. Coloca las 3 particiones en la carpeta backend/
2. Ejecuta: npm run restore-backup
3. El script fusionará las particiones automáticamente

VERIFICAR INTEGRIDAD:
Asegúrate de tener los 3 archivos y que metadata.json esté presente.
El checksum es: ${metadata.checksum}
`;

    fs.writeFileSync(readmePath, readmeContent);

    console.log('╔════════════════════════════════════════════╗');
    console.log('║  ✅ BACKUP COMPLETADO EXITOSAMENTE       ║');
    console.log('╚════════════════════════════════════════════╝\n');

    console.log(`📁 Ubicación: backups/backup_${timestamp}/\n`);

    console.log('📦 Archivos generados:');
    console.log(`   ✅ part1.sqlite`);
    console.log(`   ✅ part2.sqlite`);
    console.log(`   ✅ part3.sqlite`);
    console.log(`   ✅ metadata.json`);
    console.log(`   ✅ README.txt\n`);

    return true;

  } catch (error) {
    console.error('\n❌ Error en backup:', error.message);
    return false;
  }
}

function generateChecksum(buffer) {
  // Crear un checksum simple basado en la suma de bytes
  let checksum = 0;
  for (let i = 0; i < buffer.length; i++) {
    checksum = (checksum + buffer[i]) % 0xFFFFFFFF;
  }
  return checksum.toString(16).padStart(8, '0').toUpperCase();
}

// Ejecutar
const success = await createBackupPartitioned();
process.exit(success ? 0 : 1);
