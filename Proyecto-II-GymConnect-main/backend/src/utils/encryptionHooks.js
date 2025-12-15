import EncryptionService from '../utils/encryptionService.js';

/**
 * Hook para Sequelize que encripta y desencripta datos automáticamente
 * Uso: Agregar a los modelos que necesiten encriptación
 */

export const createEncryptionHooks = (model, camposEncriptables) => {
  /**
   * Hook BEFORE CREATE: Encriptar datos sensibles
   */
  model.beforeCreate(async (instancia) => {
    for (const campo of camposEncriptables) {
      if (instancia[campo] && instancia[campo].trim()) {
        try {
          instancia[campo] = EncryptionService.encryptReversible(instancia[campo]);
        } catch (error) {
          console.error(`Error encriptando ${campo}:`, error.message);
          throw error;
        }
      }
    }
  });

  /**
   * Hook BEFORE UPDATE: Encriptar datos sensibles que se actualicen
   */
  model.beforeUpdate(async (instancia) => {
    for (const campo of camposEncriptables) {
      // Solo encriptar si el campo cambió y tiene valor
      if (instancia.changed(campo) && instancia[campo] && instancia[campo].trim()) {
        try {
          instancia[campo] = EncryptionService.encryptReversible(instancia[campo]);
        } catch (error) {
          console.error(`Error encriptando ${campo}:`, error.message);
          throw error;
        }
      }
    }
  });

  /**
   * Hook AFTER FIND: Desencriptar datos
   * Esto se ejecuta después de cualquier query (findAll, findOne, findByPk, etc.)
   */
  const desencriptarHook = async (instancia) => {
    if (!instancia) return;

    // Si es un array (resultado de findAll)
    if (Array.isArray(instancia)) {
      for (const item of instancia) {
        await desencriptarInstancia(item);
      }
    } else {
      // Si es una instancia individual
      await desencriptarInstancia(instancia);
    }
  };

  const desencriptarInstancia = async (instancia) => {
    for (const campo of camposEncriptables) {
      if (instancia[campo]) {
        try {
          // Verificar si el dato tiene el formato de encriptación (contiene ':')
          if (typeof instancia[campo] === 'string' && instancia[campo].includes(':')) {
            instancia[campo] = EncryptionService.decryptReversible(instancia[campo]);
          }
          // Si no tiene ':' es un dato sin encriptar - dejarlo tal como está
        } catch (error) {
          console.warn(`⚠️  No se pudo desencriptar ${campo}: ${error.message}`);
          // No lanzar error, solo advertencia - podría ser dato no encriptado
          // Dejar el valor como está
        }
      }
    }
  };

  model.afterFind(desencriptarHook);

  /**
   * Método estático para encriptar manualmente un dato
   */
  model.encriptarDato = EncryptionService.encryptReversible;

  /**
   * Método estático para desencriptar manualmente
   */
  model.desencriptarDato = EncryptionService.decryptReversible;

  /**
   * Método de instancia para obtener un campo sin desencriptar
   */
  model.prototype.obtenerDatoEncriptado = function (campo) {
    return this.getDataValue(campo);
  };

  return model;
};

export default createEncryptionHooks;
