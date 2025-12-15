import LoggerService from '../utils/loggerService.js';

/**
 * Crear hooks de logging para un modelo Sequelize
 * Registra todos los cambios en la BD
 */
export const createLoggingHooks = (model, nombreModelo) => {
  /**
   * BEFORE CREATE: Registrar antes de crear
   */
  model.beforeCreate(async (instancia) => {
    const logger = new LoggerService(nombreModelo);
    logger.debug(`Preparando crear nuevo registro`, instancia.dataValues);
  });

  /**
   * AFTER CREATE: Registrar después de crear
   */
  model.afterCreate(async (instancia) => {
    LoggerService.registrarCambioBD(
      nombreModelo,
      'CREATE',
      instancia.id,
      instancia.dataValues
    );
  });

  /**
   * BEFORE UPDATE: Registrar antes de actualizar
   */
  model.beforeUpdate(async (instancia) => {
    const logger = new LoggerService(nombreModelo);
    const cambios = {};

    // Obtener solo los campos que cambiaron
    for (const campo of instancia._changed) {
      cambios[campo] = {
        anterior: instancia._previousDataValues[campo],
        nuevo: instancia.dataValues[campo]
      };
    }

    if (Object.keys(cambios).length > 0) {
      logger.debug(`Preparando actualizar registro ${instancia.id}`, cambios);
    }
  });

  /**
   * AFTER UPDATE: Registrar después de actualizar
   */
  model.afterUpdate(async (instancia) => {
    const cambios = {};

    // Obtener solo los campos que cambiaron
    for (const campo of instancia._changed) {
      cambios[campo] = {
        anterior: instancia._previousDataValues[campo],
        nuevo: instancia.dataValues[campo]
      };
    }

    if (Object.keys(cambios).length > 0) {
      LoggerService.registrarCambioBD(
        nombreModelo,
        'UPDATE',
        instancia.id,
        cambios
      );
    }
  });

  /**
   * BEFORE DESTROY: Registrar antes de eliminar
   */
  model.beforeDestroy(async (instancia) => {
    const logger = new LoggerService(nombreModelo);
    logger.debug(`Preparando eliminar registro ${instancia.id}`, instancia.dataValues);
  });

  /**
   * AFTER DESTROY: Registrar después de eliminar
   */
  model.afterDestroy(async (instancia) => {
    LoggerService.registrarCambioBD(
      nombreModelo,
      'DELETE',
      instancia.id,
      { datosEliminados: instancia.dataValues }
    );
  });

  return model;
};

export default createLoggingHooks;
