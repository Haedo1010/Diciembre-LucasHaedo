import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiala_en_produccion';

/**
 * Calcula dígito verificador para IDs
 * Algoritmo: suma ponderada con pesos crecientes (posición + 2)
 */
const calcularDigitoVerificador = (id) => {
  const strId = id.toString();
  let suma = 0;
  
  for (let i = 0; i < strId.length; i++) {
    const digito = parseInt(strId[i], 10);
    const multiplicador = (i % 2 === 0) ? 3 : 7;
    suma += digito * multiplicador;
  }
  
  return (suma % 10).toString();
};

/**
 * Valida un ID con formato: "base-digito"
 * Ejemplo: "12345-7" es válido si calcularDigitoVerificador("12345") = 7
 */
export const validarIdSeguro = (idSeguro) => {
  if (!idSeguro || typeof idSeguro !== 'string') {
    return { valido: false, error: 'ID no proporcionado' };
  }
  
  // Verificar formato "numero-digito"
  const partes = idSeguro.split('-');
  if (partes.length !== 2) {
    return { valido: false, error: 'Formato de ID inválido. Debe ser: base-digito' };
  }
  
  const [base, digito] = partes;
  
  // Validar que sean números
  if (!/^\d+$/.test(base)) {
    return { valido: false, error: 'Base del ID debe ser numérica' };
  }
  
  if (!/^\d+$/.test(digito)) {
    return { valido: false, error: 'Dígito verificador debe ser numérico' };
  }
  
  // Calcular dígito esperado
  const digitoCalculado = calcularDigitoVerificador(base);
  
  if (digitoCalculado === null) {
    return { valido: false, error: 'Error calculando dígito verificador' };
  }
  
  const digitoEsperado = digitoCalculado.toString();
  
  if (digito !== digitoEsperado) {
    return { 
      valido: false, 
      error: 'Dígito verificador incorrecto',
      detalle: `Esperado: ${digitoEsperado}, Recibido: ${digito}`
    };
  }
  
  return { 
    valido: true, 
    base: base,
    digito: digito,
    idSeguro: idSeguro
  };
};

/**
 * Middleware para validar IDs en rutas
 * Extrae el ID de req.params.id y lo valida
 */
export const verificarIdSeguro = (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return next(); // No hay ID para validar
    }
    
    
    const resultado = validarIdSeguro(id);
    
    if (!resultado.valido) {
      console.log(` ID inválido: ${resultado.error}`);
      return res.status(400).json({ 
        error: 'ID inválido',
        detalle: resultado.error,
        code: 'ID_INVALIDO'
      });
    }
    
    // Agregar ID validado al request
    req.idValidado = {
      base: resultado.base,
      digito: resultado.digito,
      completo: resultado.idSeguro
    };
    
    next();
    
  } catch (error) {
    console.error(' Error en verificarIdSeguro:', error);
    res.status(500).json({ error: 'Error interno validando ID' });
  }
};

/**
 * Genera un ID seguro con dígito verificador
 * Para usar en respuestas del backend
 */
export const generarIdSeguro = (id) => {
  
  if (!id && id !== 0) {
    return null;
  }
  
  const digito = calcularDigitoVerificador(id);
  
  const resultado = `${id}-${digito}`;
  return resultado;
};
/**
 * Middleware para verificar múltiples IDs (ej: en query params)
 */
export const verificarIdsSeguros = (campoIds) => (req, res, next) => {
  try {
    const ids = req.query[campoIds];
    
    if (!ids) {
      return next();
    }
    
    const listaIds = ids.split(',');
    const idsInvalidos = [];
    
    for (const id of listaIds) {
      const resultado = validarIdSeguro(id);
      if (!resultado.valido) {
        idsInvalidos.push({ id, error: resultado.error });
      }
    }
    
    if (idsInvalidos.length > 0) {
      return res.status(400).json({
        error: 'IDs inválidos en la solicitud',
        idsInvalidos,
        code: 'IDS_INVALIDOS'
      });
    }
    
    next();
  } catch (error) {
    console.error(' Error en verificarIdsSeguros:', error);
    res.status(500).json({ error: 'Error interno validando IDs' });
  }
};

/**
 * Decorador para respuestas: convierte IDs normales a seguros
 */
export const decorarRespuestaConIdsSeguros = (datos, camposId = ['id']) => {
  
  // Si no hay datos, retornar tal cual
  if (!datos) return datos;
  
  // Si es un array
  if (Array.isArray(datos)) {
    return datos.map(item => {
      if (!item || typeof item !== 'object') return item;
      
      const nuevoItem = { ...item };
      
      camposId.forEach(campo => {
        if (nuevoItem[campo] !== undefined && nuevoItem[campo] !== null) {
          const idNum = parseInt(nuevoItem[campo], 10);
          if (!isNaN(idNum)) {
            const digito = calcularDigitoVerificador(idNum);
            nuevoItem[campo] = `${idNum}-${digito}`;
          }
        }
      });
      
      return nuevoItem;
    });
  }
  
  // Si es un solo objeto
  if (typeof datos !== 'object') return datos;
  
  const nuevoDato = { ...datos };
  
  camposId.forEach(campo => {
    if (nuevoDato[campo] !== undefined && nuevoDato[campo] !== null) {
      const idNum = parseInt(nuevoDato[campo], 10);
      if (!isNaN(idNum)) {
        const digito = calcularDigitoVerificador(idNum);
        nuevoDato[campo] = `${idNum}-${digito}`;
      }
    }
  });
  
  return nuevoDato;
};