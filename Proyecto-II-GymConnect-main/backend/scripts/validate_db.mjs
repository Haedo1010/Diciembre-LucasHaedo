#!/usr/bin/env node

import { validateDatabase } from '../src/utils/validateDatabase.js';

console.log('╔════════════════════════════════════════════════════╗');
console.log('║     VALIDADOR DE BASE DE DATOS - GYMCONNECT        ║');
console.log('╚════════════════════════════════════════════════════╝');

validateDatabase()
  .then(() => {
    console.log('\n✅ Validación completada sin errores');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en validación:', error.message);
    process.exit(1);
  });
