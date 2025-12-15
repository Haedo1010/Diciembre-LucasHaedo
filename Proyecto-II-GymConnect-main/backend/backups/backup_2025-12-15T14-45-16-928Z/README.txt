BACKUP PARTICIONADO DE GYMCONNECT
====================================

Fecha: 15/12/2025, 11:45:16
Versión: 1.0

CONTENIDO:
- part1.sqlite: Partición 1 de 3
- part2.sqlite: Partición 2 de 3
- part3.sqlite: Partición 3 de 3
- metadata.json: Información del backup

PARA RESTAURAR:
1. Coloca las 3 particiones en la carpeta backend/
2. Ejecuta: npm run restore-backup
3. El script fusionará las particiones automáticamente

VERIFICAR INTEGRIDAD:
Asegúrate de tener los 3 archivos y que metadata.json esté presente.
El checksum es: 001784F1
