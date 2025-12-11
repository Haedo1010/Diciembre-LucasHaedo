/**
 * Calcula el dígito verificador para un ID numérico
 * @param {number|string} id - ID numérico
 * @returns {string} - Dígito verificador (0-9)
 */
export const calcularDigitoVerificador = (id) => {
  const strId = id.toString();
  let suma = 0;
  
  for (let i = 0; i < strId.length; i++) {
    const digito = parseInt(strId[i], 10);
    // Multiplicar por posición (1-based) alternando 3 y 7
    const multiplicador = (i % 2 === 0) ? 3 : 7;
    suma += digito * multiplicador;
  }
  
  const digitoVerificador = (suma % 10);
  return digitoVerificador.toString();
};

/**
 * Genera un ID seguro con dígito verificador
 * @param {number|string} id - ID numérico
 * @returns {string} - ID con formato "123-5"
 */
export const generarIdSeguro = (id) => {
  if (!id && id !== 0) return null;
  const digito = calcularDigitoVerificador(id);
  return `${id}-${digito}`;
};

/**
 * Valida si un ID seguro recibido es válido
 * @param {string} idSeguro - ID con formato "123-5"
 * @returns {Object} - { valido: boolean, id: number|null, error?: string }
 */
export const validarIdRecibido = (idSeguro) => {
  if (!idSeguro || typeof idSeguro !== 'string') {
    return {
      valido: false,
      id: null,
      error: 'ID no proporcionado o formato inválido'
    };
  }

  // Verificar formato básico
  if (!/^\d+-\d$/.test(idSeguro)) {
    return {
      valido: false,
      id: null,
      error: 'Formato de ID inválido. Debe ser "número-dígito"'
    };
  }

  const [idStr, digitoRecibido] = idSeguro.split('-');
  const idNum = parseInt(idStr, 10);

  if (isNaN(idNum)) {
    return {
      valido: false,
      id: null,
      error: 'ID no es un número válido'
    };
  }

  // Calcular dígito esperado
  const digitoEsperado = calcularDigitoVerificador(idNum);

  if (digitoRecibido !== digitoEsperado) {
    return {
      valido: false,
      id: idNum,
      error: `Dígito verificador inválido. Esperado: ${digitoEsperado}, Recibido: ${digitoRecibido}`
    };
  }

  return {
    valido: true,
    id: idNum,
    idSeguro: idSeguro
  };
};

/**
 * Extrae el ID numérico de un ID seguro (para envíos al backend)
 * @param {string} idSeguro - ID con formato "123-5"
 * @returns {number|null} - ID numérico o null si es inválido
 */
export const extraerIdNumerico = (idSeguro) => {
  const validacion = validarIdRecibido(idSeguro);
  return validacion.valido ? validacion.id : null;
};

/**
 * Convierte un objeto que contiene IDs a formato seguro
 * @param {Object} objeto - Objeto que puede contener IDs
 * @param {Array<string>} camposId - Nombres de campos que son IDs
 * @returns {Object} - Objeto con IDs convertidos a formato seguro
 */
export const convertirObjetoConIdsSeguros = (objeto, camposId = ['id', 'userId', 'usuarioId', 'solicitudId', 'profesorId', 'claseId']) => {
  if (!objeto || typeof objeto !== 'object') return objeto;
  
  const resultado = { ...objeto };
  
  camposId.forEach(campo => {
    if (resultado[campo] !== undefined && resultado[campo] !== null) {
      // Si ya es un ID seguro, validarlo
      if (typeof resultado[campo] === 'string' && resultado[campo].includes('-')) {
        const validacion = validarIdRecibido(resultado[campo]);
        if (!validacion.valido) {
          console.warn(`ID seguro inválido en campo ${campo}:`, resultado[campo]);
        }
      } else {
        // Convertir a ID seguro
        resultado[campo] = generarIdSeguro(resultado[campo]);
      }
    }
  });
  
  return resultado;
};

/**
 * Valida todos los IDs en un array de objetos
 * @param {Array<Object>} array - Array de objetos que pueden contener IDs
 * @param {Array<string>} camposId - Nombres de campos que son IDs
 * @returns {Array<Object>} - Array con objetos validados y marcados
 */
export const validarIdsEnArray = (array, camposId = ['id', 'userId', 'usuarioId', 'solicitudId']) => {
  if (!Array.isArray(array)) return [];
  
  return array.map(item => {
    const itemConValidacion = { ...item, _idsValidos: true };
    
    camposId.forEach(campo => {
      if (item[campo] && typeof item[campo] === 'string' && item[campo].includes('-')) {
        const validacion = validarIdRecibido(item[campo]);
        if (!validacion.valido) {
          itemConValidacion._idsValidos = false;
          itemConValidacion[`${campo}_error`] = validacion.error;
          console.warn(`ID inválido en ${campo}:`, item[campo], validacion.error);
        }
      }
    });
    
    return itemConValidacion;
  });
};