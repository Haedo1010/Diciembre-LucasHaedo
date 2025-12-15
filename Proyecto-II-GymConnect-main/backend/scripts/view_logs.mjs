#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import LoggerService from '../src/utils/loggerService.js';

const LOGS_DIR = LoggerService.obtenerDirectorioLogs();

const mostrarArchivoLog = (nombreArchivo) => {
  const rutaCompleta = path.join(LOGS_DIR, nombreArchivo);

  if (!fs.existsSync(rutaCompleta)) {
    console.log(`\n❌ Archivo no encontrado: ${nombreArchivo}\n`);
    return;
  }

  const contenido = fs.readFileSync(rutaCompleta, 'utf8');
  const stats = fs.statSync(rutaCompleta);

  console.log('\n╔════════════════════════════════════════════╗');
  console.log(`║  ARCHIVO DE LOG: ${nombreArchivo}`);
  console.log('╚════════════════════════════════════════════╝\n');

  console.log(`📊 Información del archivo:`);
  console.log(`   Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`   Última modificación: ${stats.mtime.toLocaleString()}`);
  console.log(`   Líneas: ${contenido.split('\n').filter(l => l.trim()).length}\n`);

  console.log('━'.repeat(100));
  console.log(contenido);
  console.log('━'.repeat(100));
};

const listarLogs = () => {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║      ARCHIVOS DE LOG DISPONIBLES          ║');
  console.log('╚════════════════════════════════════════════╝\n');

  if (!fs.existsSync(LOGS_DIR)) {
    console.log('❌ No hay directorio de logs\n');
    return;
  }

  const archivos = fs.readdirSync(LOGS_DIR)
    .filter(f => f.endsWith('.txt'))
    .sort()
    .reverse();

  if (archivos.length === 0) {
    console.log('⊘ No hay archivos de log\n');
    return;
  }

  archivos.forEach((archivo, indice) => {
    const rutaCompleta = path.join(LOGS_DIR, archivo);
    const stats = fs.statSync(rutaCompleta);
    const lineas = fs.readFileSync(rutaCompleta, 'utf8').split('\n').filter(l => l.trim()).length;

    console.log(`${indice + 1}. ${archivo}`);
    console.log(`   Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   Líneas: ${lineas}`);
    console.log(`   Modificado: ${stats.mtime.toLocaleString()}\n`);
  });
};

const mostrarEstadisticas = () => {
  const stats = LoggerService.obtenerEstadisticasDelDia();

  if (!stats) {
    console.log('\n⊘ No hay logs para hoy\n');
    return;
  }

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║     ESTADÍSTICAS DE LOGS (HOY)            ║');
  console.log('╚════════════════════════════════════════════╝\n');

  console.log(`📊 Total de registros: ${stats.totalRegistros}`);
  console.log(`   🐛 DEBUG: ${stats.debug}`);
  console.log(`   ℹ️  INFO: ${stats.info}`);
  console.log(`   ⚠️  WARN: ${stats.warn}`);
  console.log(`   ❌ ERROR: ${stats.error}\n`);

  console.log(`🔐 Accesos de usuarios: ${stats.accesoUsuarios}`);
  console.log(`💾 Cambios en BD: ${stats.cambiosBD}`);
  console.log(`📡 API Requests: ${stats.apiRequests}\n`);

  console.log(`📁 Total de archivos de log: ${stats.archivos}\n`);
};

const buscarEnLogs = (termino) => {
  if (!fs.existsSync(LOGS_DIR)) {
    console.log('❌ No hay directorio de logs\n');
    return;
  }

  console.log(`\n🔍 Buscando: "${termino}"\n`);

  const archivos = fs.readdirSync(LOGS_DIR)
    .filter(f => f.endsWith('.txt'))
    .sort()
    .reverse();

  let totalEncontrados = 0;

  for (const archivo of archivos) {
    const rutaCompleta = path.join(LOGS_DIR, archivo);
    const contenido = fs.readFileSync(rutaCompleta, 'utf8');
    const lineas = contenido.split('\n');

    const encontrados = lineas
      .map((linea, indice) => ({
        linea,
        indice: indice + 1,
        encontrado: linea.toLowerCase().includes(termino.toLowerCase())
      }))
      .filter(r => r.encontrado);

    if (encontrados.length > 0) {
      console.log(`\n📄 ${archivo} (${encontrados.length} coincidencias):`);
      console.log('─'.repeat(100));

      encontrados.forEach(({ linea, indice }) => {
        console.log(`   [Línea ${indice}] ${linea}`);
      });

      totalEncontrados += encontrados.length;
    }
  }

  console.log(`\n📊 Total encontrado: ${totalEncontrados} coincidencias\n`);
};

const mostrarUltimasLineas = (cantidad = 50) => {
  const archivo = LoggerService.obtenerUltimoLog();

  if (!fs.existsSync(archivo)) {
    console.log('\n⊘ No hay logs para hoy\n');
    return;
  }

  const contenido = fs.readFileSync(archivo, 'utf8');
  const lineas = contenido.split('\n').filter(l => l.trim());
  const ultimas = lineas.slice(-cantidad);

  console.log(`\n╔════════════════════════════════════════════╗`);
  console.log(`║  ÚLTIMAS ${cantidad} LÍNEAS DE LOG (HOY)             ║`);
  console.log('╚════════════════════════════════════════════╝\n');

  ultimas.forEach((linea, indice) => {
    const numeroLinea = lineas.length - cantidad + indice + 1;
    console.log(`[${numeroLinea}] ${linea}`);
  });

  console.log('\n');
};

// Procesar argumentos
const args = process.argv.slice(2);
const comando = args[0];

switch (comando) {
  case 'list':
  case 'ls':
    listarLogs();
    break;

  case 'stats':
  case 'estadisticas':
    mostrarEstadisticas();
    break;

  case 'hoy':
  case 'today':
    mostrarArchivoLog(path.basename(LoggerService.obtenerUltimoLog()));
    break;

  case 'tail':
  case 'ultimas':
    const cantidad = parseInt(args[1]) || 50;
    mostrarUltimasLineas(cantidad);
    break;

  case 'buscar':
  case 'search':
    if (!args[1]) {
      console.log('\n❌ Especifica un término de búsqueda');
      console.log('   Uso: node view_logs.mjs buscar "término"\n');
    } else {
      buscarEnLogs(args[1]);
    }
    break;

  case 'limpiar':
  case 'clean':
    const diasRetener = parseInt(args[1]) || 30;
    const eliminados = LoggerService.limpiarLogsAntiguos(diasRetener);
    console.log(`\n✅ Se eliminaron ${eliminados} archivos de log antiguos\n`);
    break;

  default:
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║        VISOR DE LOGS - GYMCONNECT         ║');
    console.log('╚════════════════════════════════════════════╝\n');

    console.log('Comandos disponibles:\n');
    console.log('  list             - Listar todos los archivos de log');
    console.log('  stats            - Mostrar estadísticas de hoy');
    console.log('  hoy              - Mostrar log del día actual');
    console.log('  tail [N]         - Mostrar últimas N líneas (default: 50)');
    console.log('  buscar "término" - Buscar en todos los logs');
    console.log('  limpiar [N]      - Eliminar logs > N días (default: 30)\n');

    console.log('Ejemplos:\n');
    console.log('  npm run logs list');
    console.log('  npm run logs stats');
    console.log('  npm run logs tail 100');
    console.log('  npm run logs buscar "ERROR"\n');

    mostrarEstadisticas();
    break;
}
