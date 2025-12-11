import express from 'express';
import ProfesorRequest from '../models/ProfesorRequest.js';
import { enviarEmailSolicitudRecibida } from '../config/email.js';
import { generarIdSeguro } from '../utils/idSeguro.js';

const router = express.Router();

// Solicitar ser profesor (SIN token)
router.post('/solicitar', async (req, res) => {
  try {
    const { nombre, email_personal, telefono, mensaje } = req.body;

    // Crear solicitud sin usuario_id (no están logueados)
    const solicitud = await ProfesorRequest.create({
      usuario_id: null,
      nombre,
      email_personal,
      telefono,
      mensaje,
      estado: 'pendiente'
    });
    const idSeguro = generarIdSeguro(solicitud.id);

    // Enviar email de confirmación (NO bloqueante)
    enviarEmailSolicitudRecibida({
      nombre: nombre ? nombre.trim() : '',
      email_personal: email_personal ? email_personal.trim() : '',
      telefono: telefono ? telefono.trim() : '',
      mensaje: mensaje ? mensaje.trim() : ''
    }).then(result => {
      if (result.success) {
        console.log('✅ Email de confirmación enviado a:', email_personal);
      } else {
        console.warn('⚠️ Email no enviado:', result.error);
      }
    }).catch(emailError => {
      console.warn('⚠️ Error en email (no crítico):', emailError.message);
    });

    // Responder inmediatamente al frontend
    res.status(201).json({ 
      success: true,
      message: 'Solicitud enviada exitosamente',
      solicitud: {
        id: idSeguro,
        id_base: solicitud.id,
        nombre: solicitud.nombre,
        email_personal: solicitud.email_personal,
        estado: solicitud.estado,
        fecha_solicitud: solicitud.createdAt
      }
    });
  } catch (error) {
    console.error('Error creando solicitud:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;