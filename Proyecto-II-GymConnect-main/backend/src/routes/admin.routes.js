import express from 'express';
import User from '../models/User.js';
import ProfesorRequest from '../models/ProfesorRequest.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';
import { 
  verificarIdSeguro, 
  generarIdSeguro,
  decorarRespuestaConIdsSeguros 
} from '../middlewares/seguridadMiddleware.js';
import { enviarEmailAprobacion } from '../config/email.js';
import bcrypt from 'bcrypt';
import { validarIdRecibido } from '../utils/idSeguro.js';
import { Op } from 'sequelize';

const router = express.Router();

// Middleware para todas las rutas admin que usan IDs
const validarRutasConId = [verifyToken, verifyAdmin, verificarIdSeguro];

// Obtener todos los usuarios (con búsqueda opcional) - ADMIN ONLY
router.get('/usuarios', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { buscar } = req.query;
    
    let opciones = {
      attributes: ['id', 'nombre', 'email', 'rol', 'telefono', 'createdAt', 'deletedAt', 'isBlocked', 'blockedAt', 'blockReason', 'loginLockedUntil', 'verificationLockedUntil'],
      raw: true,
      where: {
        deletedAt: null  // Solo usuarios no eliminados
      }
    };
    
    if (buscar) {
      opciones.where[Op.or] = [
        { nombre: { [Op.iLike]: `%${buscar}%` } },
        { email: { [Op.iLike]: `%${buscar}%` } }
      ];
    }
    
    const usuarios = await User.findAll(opciones);
    
    const usuariosDecorados = usuarios.map(usuario => {
      // Función para calcular dígito
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
      
      // Solo modificar si existe id
      if (usuario.id !== undefined && usuario.id !== null) {
        const idNum = parseInt(usuario.id, 10);
        if (!isNaN(idNum)) {
          const digito = calcularDigitoVerificador(idNum);
          return {
            ...usuario,
            id: `${idNum}-${digito}`
          };
        }
      }
      
      return usuario;
    });
    
    res.json(usuariosDecorados);
  } catch (error) {
    console.error(' Error en /usuarios:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener solicitudes de profesor - ADMIN ONLY
router.get('/solicitudes-profesor', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const solicitudes = await ProfesorRequest.findAll({
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Formatear respuesta SIN decoración de IDs
    const solicitudesConIdsSeguros = solicitudes.map(solicitud => {
      const data = solicitud.get({ plain: true });
      
      return {
        id: generarIdSeguro(data.id),
        usuario_id: data.usuario_id ? generarIdSeguro(data.usuario_id) : null,
        nombre: data.nombre,
        email_personal: data.email_personal,
        telefono: data.telefono || 'No especificado',
        mensaje: data.mensaje,
        estado: data.estado,
        fecha_solicitud: data.createdAt,
        fecha_formateada: new Date(data.createdAt).toLocaleDateString('es-ES'),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        usuario: data.usuario
      };
    });

    res.json(solicitudesConIdsSeguros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aprobar solicitud de profesor - CON VALIDACIÓN DE ID SEGURO
router.post('/aprobar-profesor/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const validacion = validarIdRecibido(req.params.id);
    
    if (!validacion.valido) {
      return res.status(400).json({ 
        error: validacion.error,
        id_recibido: req.params.id
      });
    }

    const idBase = validacion.id;

    const solicitud = await ProfesorRequest.findByPk(idBase, {
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email'],
          required: false,
        },
      ],
    });

    if (!solicitud) {
      return res.status(404).json({ 
        error: 'Solicitud no encontrada',
        id_buscado: validacion.idSeguro
      });
    }

    console.log(' Datos solicitud:', {
      nombre: solicitud.nombre,
      email_personal: solicitud.email_personal,
      usuario_id: solicitud.usuario_id
    });

    // Generar contraseña temporal
    const passwordTemporal = 'GymConnect2024';
    const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

    let usuario = await User.findOne({ 
      where: { email: solicitud.email_personal } 
    });

    if (usuario) {
      // USUARIO YA EXISTE - ACTUALIZAR ROL
      console.log(`👤 Usuario existente encontrado:`, {
        id: usuario.id,
        email: usuario.email,
        rol_actual: usuario.rol,
        nombre_actual: usuario.nombre
      });
      
      // Verificar si ya es profesor
      if (usuario.rol === 'profesor') {
        console.log(' Usuario ya es profesor, solo actualizando solicitud');
      } else {
        // Cambiar rol a profesor
        console.log(` Cambiando rol de "${usuario.rol}" a "profesor"`);
        usuario.rol = 'profesor';
        await usuario.save();
        console.log(' Rol actualizado');
      }
      
      // Actualizar nombre si es diferente
      if (usuario.nombre !== solicitud.nombre) {
        console.log(` Actualizando nombre de "${usuario.nombre}" a "${solicitud.nombre}"`);
        usuario.nombre = solicitud.nombre;
        await usuario.save();
      }
      
    } else {
      // CREAR NUEVO USUARIO (caso raro, pero por si acaso)
      console.log('👤 Creando nuevo usuario...');
      const passwordTemporal = 'GymConnect2024';
      const hashedPassword = await bcrypt.hash(passwordTemporal, 10);
      
      usuario = await User.create({
        nombre: solicitud.nombre,
        email: solicitud.email_personal,
        password: hashedPassword,
        rol: 'profesor',
        telefono: solicitud.telefono || null,
        estado: true
      });
      console.log(` Usuario creado ID: ${usuario.id}`);
    }

    if (solicitud.usuario_id !== usuario.id) {
      console.log(` Actualizando solicitud.usuario_id de ${solicitud.usuario_id} a ${usuario.id}`);
      solicitud.usuario_id = usuario.id;
    }
    
    solicitud.estado = 'aprobada';
    await solicitud.save();
    console.log(` Solicitud actualizada. Estado: ${solicitud.estado}, Usuario ID: ${solicitud.usuario_id}`);

    // VERIFICAR CAMBIOS
    const usuarioVerificado = await User.findByPk(usuario.id);
    const solicitudVerificada = await ProfesorRequest.findByPk(idBase);
    
    console.log(' VERIFICACIÓN FINAL:');
    console.log('  Usuario rol:', usuarioVerificado.rol);
    console.log('  Solicitud estado:', solicitudVerificada.estado);
    console.log('  Solicitud usuario_id:', solicitudVerificada.usuario_id);

    // ENVIAR EMAIL DE APROBACIÓN (opcional)
    try {
      await enviarEmailAprobacion({
        nombre: usuario.nombre,
        email_personal: solicitud.email_personal,
      });
      console.log(` Email enviado a: ${solicitud.email_personal}`);
    } catch (emailError) {
      console.error(' Error enviando email:', emailError.message);
    }

    // Respuesta detallada
    res.json({
      success: true,
      message: ' Solicitud aprobada exitosamente',
      detalles: {
        usuario_existia: !!usuario.id,
        rol_actualizado: usuario.rol === 'profesor',
        solicitud_actualizada: true
      },
      solicitud: {
        id: generarIdSeguro(solicitud.id),
        nombre: solicitud.nombre,
        email_personal: solicitud.email_personal,
        estado: solicitud.estado,
        usuario_id: generarIdSeguro(solicitud.usuario_id)
      },
      usuario: {
        id: generarIdSeguro(usuario.id),
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono
      }
    });
    
  } catch (error) {
    console.error(' ERROR CRÍTICO en aprobación:', error.message);
    console.error('Stack:', error.stack);
    
    // Manejar error de email duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        error: 'El email ya existe en el sistema con otro ID. Contacta al administrador.',
        email: error.fields?.[0]
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error interno aprobando solicitud',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rechazar solicitud de profesor - CON VALIDACIÓN DE ID SEGURO
router.post('/rechazar-profesor/:id', ...validarRutasConId, async (req, res) => {
  try {
    const idBase = req.idValidado.base; // Usar ID validado
    
    const solicitud = await ProfesorRequest.findByPk(idBase);

    if (!solicitud) {
      return res.status(404).json({ 
        error: 'Solicitud no encontrada',
        idRecibido: req.idValidado.completo
      });
    }

    solicitud.estado = 'rechazada';
    await solicitud.save();

    // Decorar respuesta con ID seguro
    const respuestaDecorada = decorarRespuestaConIdsSeguros({
      message: 'Solicitud rechazada',
      solicitud
    });

    res.json(respuestaDecorada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar usuario - CON VALIDACIÓN DE ID SEGURO
router.put('/usuario/:id', ...validarRutasConId, async (req, res) => {
  try {
    const validacion = validarIdRecibido(req.params.id);
    
    if (!validacion.valido) {
      return res.status(400).json({ 
        error: validacion.error,
        id_recibido: req.params.id
      });
    }

    const idBase = validacion.id;
    const { rol, nombre, email, telefono } = req.body;

    const user = await User.findByPk(idBase);
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        idBuscado: validacion.idSeguro
      });
    }

    // Proteger admin principal - no puede cambiar su rol
    if (user.email === 'admin@gymconnect.com' && rol) {
      return res.status(403).json({ 
        error: 'No se puede cambiar el rol del admin principal',
        cuenta_protegida: user.email
      });
    }

    // Validar que no se cambie a un rol inválido
    const rolesValidos = ['cliente', 'profesor', 'admin'];
    if (rol && !rolesValidos.includes(rol)) {
      return res.status(400).json({ 
        error: 'Rol inválido',
        rolesPermitidos: rolesValidos
      });
    }

    if (rol) user.rol = rol;
    if (nombre) user.nombre = nombre;
    if (email) user.email = email;
    if (telefono) user.telefono = telefono;

    await user.save();
    
    res.json({
      message: 'Usuario actualizado exitosamente',
      user: {
        id: generarIdSeguro(user.id),
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        telefono: user.telefono
      }
    });
  } catch (error) {
    // Manejar duplicado de email
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: 'El email ya existe en el sistema',
        campo: error.fields?.[0]
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// Eliminar usuario - CON VALIDACIÓN DE ID SEGURO
router.delete('/usuario/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const validacion = validarIdRecibido(req.params.id);
    
    if (!validacion.valido) {
      return res.status(400).json({ 
        error: validacion.error,
        id_recibido: req.params.id
      });
    }

    const idBase = validacion.id;
    
    const user = await User.findByPk(idBase);

    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        idBuscado: validacion.idSeguro
      });
    }

    // Proteger contra borrar admin principal
    if (user.email === 'admin@gymconnect.com') {
      return res.status(403).json({ 
        error: 'No se puede eliminar la cuenta del admin principal',
        cuenta_protegida: user.email
      });
    }

    const nombreEliminado = user.nombre;
    const emailEliminado = user.email;
    
    // Borrado lógico - solo actualizar deletedAt
    user.deletedAt = new Date();
    await user.save();
    
    res.json({ 
      message: 'Usuario eliminado exitosamente',
      usuario_eliminado: {
        id: validacion.idSeguro,
        nombre: nombreEliminado,
        email: emailEliminado,
        eliminado_en: user.deletedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bloquear/Desbloquear usuario - ADMIN ONLY
router.put('/usuarios/:id/toggle-block', validarRutasConId, async (req, res) => {
  try {
    const { blockReason } = req.body;

    // Obtener ID numérico validado por el middleware de ID seguro si existe
    const idParam = req.idValidado && req.idValidado.base ? parseInt(req.idValidado.base, 10) : (req.params.id);
    const user = await User.findByPk(idParam);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Proteger al admin principal de ser bloqueado
    if (user.email === 'admin@gymconnect.com') {
      return res.status(403).json({ error: 'No puedes bloquear al admin principal' });
    }

    const ahora = new Date();
    
    if (user.isBlocked) {
      // Desbloquear
      user.isBlocked = false;
      user.blockedAt = null;
      user.blockReason = null;
      await user.save();

      return res.json({
        success: true,
        message: `Usuario ${user.email} desbloqueado`,
        usuario: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          isBlocked: user.isBlocked
        }
      });
    } else {
      // Bloquear
      user.isBlocked = true;
      user.blockedAt = ahora;
      user.blockReason = blockReason || 'Bloqueado por administrador';
      await user.save();

      return res.json({
        success: true,
        message: `Usuario ${user.email} bloqueado`,
        usuario: {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          isBlocked: user.isBlocked,
          blockReason: user.blockReason
        }
      });
    }
  } catch (error) {
    console.error(' Error bloqueando/desbloqueando usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener descripción completa de un usuario: compras y clases
router.get('/usuarios/:id/descripcion', validarRutasConId, async (req, res) => {
  try {
    // Obtener ID numérico validado por el middleware de ID seguro si existe
    const idParam = req.idValidado && req.idValidado.base ? parseInt(req.idValidado.base, 10) : (req.params.id);

    const user = await User.findByPk(idParam, {
      attributes: ['id', 'nombre', 'email', 'rol', 'telefono', 'isBlocked', 'blockedAt']
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Obtener enrollments con info de clase
    const enrollments = await user.getEnrollments({
      include: [{ association: 'clase', attributes: ['id', 'nombre', 'descripcion', 'fecha'] }]
    });

    // Obtener órdenes y items con producto
    const Product = (await import('../models/Product.js')).default;
    const orders = await user.getOrders({
      include: [{ association: 'items', include: [{ model: Product, attributes: ['id', 'nombre', 'precio', 'imagen'] }] }]
    });

    res.json({
      usuario: user,
      inscripciones: enrollments,
      compras: orders
    });
  } catch (error) {
    console.error(' Error en /usuarios/:id/descripcion:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener usuarios no verificados - ADMIN ONLY
router.get('/usuarios-no-verificados', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const usuariosNoVerificados = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'emailVerified', 'verificationCode', 'createdAt'],
      where: {
        emailVerified: false,
        deletedAt: null
      },
      raw: true,
      order: [['createdAt', 'DESC']]
    });

    // Decorar IDs con dígito verificador
    const usuariosDecorados = usuariosNoVerificados.map(usuario => {
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

      if (usuario.id !== undefined && usuario.id !== null) {
        const idNum = parseInt(usuario.id, 10);
        if (!isNaN(idNum)) {
          const digito = calcularDigitoVerificador(idNum);
          return {
            ...usuario,
            id: `${idNum}-${digito}`,
            idBase: idNum
          };
        }
      }
      return usuario;
    });

    res.json(usuariosDecorados);
  } catch (error) {
    console.error(' Error en /usuarios-no-verificados:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verificar usuario manualmente - ADMIN ONLY
router.post('/verificar-usuario/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const validacion = validarIdRecibido(req.params.id);
    
    if (!validacion.valido) {
      return res.status(400).json({ 
        error: validacion.error,
        id_recibido: req.params.id
      });
    }

    const idBase = validacion.id;

    const usuario = await User.findByPk(idBase);

    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado',
        id_buscado: validacion.idSeguro
      });
    }

    // Marcar como verificado
    usuario.emailVerified = true;
    usuario.verificationCode = null;
    usuario.verificationCodeExpiresAt = null;
    usuario.verificationAttempts = 0;
    usuario.verificationLockedUntil = null;

    await usuario.save();

    res.json({
      mensaje: `Usuario ${usuario.nombre} (${usuario.email}) verificado exitosamente`,
      usuario: {
        id: `${usuario.id}-${((usuario.id.toString().split('').reduce((sum, digit, i) => sum + parseInt(digit) * ((i % 2 === 0) ? 3 : 7), 0)) % 10)}`,
        nombre: usuario.nombre,
        email: usuario.email,
        emailVerified: usuario.emailVerified
      }
    });
  } catch (error) {
    console.error(' Error en /verificar-usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;