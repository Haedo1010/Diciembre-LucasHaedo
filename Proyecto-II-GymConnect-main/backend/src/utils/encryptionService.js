import crypto from 'crypto';
import bcrypt from 'bcrypt';

// Llave maestra para encriptación reversible (debería venir de variables de entorno)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'gymnasium-secret-key-32-chars-long!'; // 32 caracteres para AES-256

// Validar que la clave tenga longitud correcta
if (ENCRYPTION_KEY.length < 32) {
  console.warn('⚠️  ENCRYPTION_KEY debe tener al menos 32 caracteres para seguridad AES-256');
}

// Derivar una clave de 32 bytes desde la ENCRYPTION_KEY
const derivedKey = crypto
  .createHash('sha256')
  .update(ENCRYPTION_KEY)
  .digest();

/**
 * Clase de Encriptación con métodos reversibles e irreversibles
 */
class EncryptionService {
  /**
   * ENCRIPTACIÓN REVERSIBLE (Simétrica - AES-256-CBC)
   * Usada para: emails, códigos de verificación, datos sensibles que necesiten ser leídos
   */

  static encryptReversible(texto) {
    if (!texto) return null;

    try {
      // Generar IV aleatorio (16 bytes)
      const iv = crypto.randomBytes(16);

      // Crear cipher
      const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);

      // Encriptar
      let encrypted = cipher.update(texto, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Retornar IV + encriptado (separados por :)
      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      console.error('Error en encriptación reversible:', error.message);
      throw new Error(`No se pudo encriptar el dato: ${error.message}`);
    }
  }

  static decryptReversible(textoEncriptado) {
    if (!textoEncriptado) return null;

    try {
      // Separar IV del texto encriptado
      const partes = textoEncriptado.split(':');
      if (partes.length !== 2) {
        throw new Error('Formato de encriptación inválido');
      }

      const iv = Buffer.from(partes[0], 'hex');
      const encrypted = partes[1];

      // Crear decipher
      const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, iv);

      // Desencriptar
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Error en desencriptación reversible:', error.message);
      throw new Error(`No se pudo desencriptar el dato: ${error.message}`);
    }
  }

  /**
   * ENCRIPTACIÓN IRREVERSIBLE (Hash - bcrypt)
   * Usada para: contraseñas, datos que NO necesitan ser recuperados
   * NOTA: bcrypt ya está siendo usado en el proyecto, esta es la interfaz unificada
   */

  static async hashIrreversible(texto, saltRounds = 10) {
    if (!texto) return null;

    try {
      const hashed = await bcrypt.hash(texto, saltRounds);
      return hashed;
    } catch (error) {
      console.error('Error en hash irreversible:', error.message);
      throw new Error(`No se pudo hashear el dato: ${error.message}`);
    }
  }

  static async compareIrreversible(textoPlano, textoHasheado) {
    if (!textoPlano || !textoHasheado) return false;

    try {
      return await bcrypt.compare(textoPlano, textoHasheado);
    } catch (error) {
      console.error('Error comparando hash:', error.message);
      return false;
    }
  }

  /**
   * ENCRIPTACIÓN CON HASH (Combinada)
   * Reversible pero también hasheada - útil para verificar integridad
   */

  static encryptWithHash(texto) {
    if (!texto) return null;

    try {
      const encrypted = this.encryptReversible(texto);

      // Generar hash del texto original para verificar integridad
      const hash = crypto
        .createHash('sha256')
        .update(texto)
        .digest('hex');

      return `${encrypted}|${hash}`;
    } catch (error) {
      console.error('Error en encriptación con hash:', error.message);
      throw error;
    }
  }

  static decryptWithHashVerification(textoEncriptado) {
    if (!textoEncriptado) return null;

    try {
      const partes = textoEncriptado.split('|');
      if (partes.length !== 2) {
        throw new Error('Formato de encriptación con hash inválido');
      }

      const encrypted = partes[0];
      const originalHash = partes[1];

      // Desencriptar
      const decrypted = this.decryptReversible(encrypted);

      // Verificar hash
      const newHash = crypto
        .createHash('sha256')
        .update(decrypted)
        .digest('hex');

      if (newHash !== originalHash) {
        console.warn('⚠️  Advertencia: Hash no coincide - datos posiblemente alterados');
      }

      return decrypted;
    } catch (error) {
      console.error('Error en verificación de hash:', error.message);
      throw error;
    }
  }

  /**
   * GENERADOR DE CÓDIGOS SEGUROS
   */

  static generarCodigoVerificacion(longitud = 6) {
    // Generar números aleatorios
    const codigo = crypto
      .randomBytes(Math.ceil(longitud / 2))
      .toString('hex')
      .slice(0, longitud);

    return codigo.toUpperCase();
  }

  static generarTokenSeguro(longitud = 32) {
    return crypto.randomBytes(longitud).toString('hex');
  }

  /**
   * INFORMACIÓN DE ENCRIPTACIÓN
   */

  static getEncryptionInfo() {
    return {
      algoritmoReversible: 'AES-256-CBC',
      algoritmoIrreversible: 'bcrypt',
      longitudClave: 32,
      detalles: {
        reversible: {
          uso: 'Emails, códigos de verificación, datos que necesitan ser leídos',
          seguro: 'Con IV aleatorio para cada encriptación',
          recuperable: 'Sí - mediante la clave maestra'
        },
        irreversible: {
          uso: 'Contraseñas, datos que no necesitan ser recuperados',
          seguro: 'bcrypt con salt',
          recuperable: 'No - por diseño'
        }
      }
    };
  }
}

export default EncryptionService;
