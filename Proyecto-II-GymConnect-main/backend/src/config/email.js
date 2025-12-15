import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const emailUser = process.env.SMTP_USER;
const emailPass = process.env.SMTP_PASS;

// Validación
if (!emailUser || !emailPass) {
  console.error(' ERROR: Variables SMTP_USER o SMTP_PASS no configuradas en .env');
  throw new Error('Configuración de email incompleta');
}

// Crear transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

// Verificar conexión
transporter.verify((error) => {
  if (error) {
    console.error(' ERROR SMTP:', error.message);
  } else {
    console.log(' SMTP LISTO - Emails funcionando');
  }
});

// Función de envío de email
export const enviarEmailSolicitudRecibida = async (datos) => {
  const { nombre, email_personal, telefono, mensaje } = datos;
  
  const mailOptions = {
    from: `"GymConnect" <${emailUser}>`,
    to: email_personal,
    subject: '📋 Hemos recibido tu solicitud como Profesor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00ff87;">¡Hola ${nombre}!</h2>
        <p>Hemos recibido tu solicitud para ser profesor en <strong>GymConnect</strong>.</p>
        <p>Te contactaremos en las próximas 48 horas.</p>
        <p>Saludos,<br>Equipo GymConnect</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(` Email enviado a: ${email_personal}`);
    return { 
      success: true, 
      messageId: info.messageId 
    };
  } catch (error) {
    console.error(' Error enviando email:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export const enviarEmailAprobacion = async (datos) => {
  const { nombre, email_personal } = datos;
  
  const mailOptions = {
    from: `"GymConnect" <${emailUser}>`,
    to: email_personal,
    subject: ' ¡Felicidades! Has sido aprobado como Profesor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00ff87;">¡Hola ${nombre}!</h2>
        <p>Nos complace informarte que <strong>has sido aprobado</strong> como profesor en <strong>GymConnect</strong>.</p>
        <p>Ahora puedes acceder a tu panel de profesor y comenzar a crear clases.</p>
        <p>Saludos,<br>Equipo GymConnect</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(` Email de aprobación enviado a: ${email_personal}`);
    return { 
      success: true, 
      messageId: info.messageId 
    };
  } catch (error) {
    console.error(' Error enviando email de aprobación:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export const enviarCodigoVerificacion = async (datos) => {
  const { email, codigo } = datos;
  
  const mailOptions = {
    from: `"GymConnect" <${emailUser}>`,
    to: email,
    subject: '🔐 Código de verificación de GymConnect',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
        <div style="text-align: center;">
          <h2 style="color: #00ff87; margin: 0;">GymConnect</h2>
          <p style="color: #666; margin: 10px 0;">Verificación de Email</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #333; font-size: 16px;">Hola,</p>
          <p style="color: #333; font-size: 16px;">Tu código de verificación es:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #00ff87; color: #000; padding: 15px 30px; border-radius: 5px; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
              ${codigo}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px;">Este código expira en <strong>15 minutos</strong>.</p>
          <p style="color: #666; font-size: 14px;">Si no solicitaste este código, ignora este email.</p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
          <p>© 2025 GymConnect. Todos los derechos reservados.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(` Código de verificación enviado a: ${email}`);
    return { 
      success: true, 
      messageId: info.messageId 
    };
  } catch (error) {
    console.error(' Error enviando código de verificación:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export const enviarComprobanteCompra = async (datos) => {
  const { email, nombre, orderId, items, total, metodoPago, numeroTarjeta } = datos;
  
  const itemsHtml = items.map(item => `
    <tr style="border-bottom: 1px solid #e0e0e0;">
      <td style="padding: 10px; color: #333;">${item.nombre}</td>
      <td style="padding: 10px; text-align: center; color: #333;">${item.cantidad}</td>
      <td style="padding: 10px; text-align: right; color: #00ff87; font-weight: bold;">$${item.subtotal.toFixed(2)}</td>
    </tr>
  `).join('');

  const ultimosDigitos = numeroTarjeta ? numeroTarjeta.slice(-3) : 'N/A';
  
  const mailOptions = {
    from: `"GymConnect" <${emailUser}>`,
    to: email,
    subject: '✅ Comprobante de Pago - GymConnect',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00ff87; margin: 0; font-size: 28px;">GymConnect</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Comprobante de Pago</p>
        </div>

        <div style="background-color: white; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #333; font-size: 16px;">Hola <strong>${nombre}</strong>,</p>
          <p style="color: #666; font-size: 14px;">Tu pago ha sido procesado exitosamente. A continuación detallamos tu orden:</p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #00ff87; border-radius: 4px;">
            <p style="color: #333; margin: 0; font-size: 14px;"><strong>Número de Orden:</strong> #${orderId}</p>
            <p style="color: #333; margin: 8px 0 0 0; font-size: 14px;"><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #00ff87; color: #000;">
                <th style="padding: 12px; text-align: left; font-weight: bold;">Producto</th>
                <th style="padding: 12px; text-align: center; font-weight: bold;">Cantidad</th>
                <th style="padding: 12px; text-align: right; font-weight: bold;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin: 20px 0; padding-top: 20px; border-top: 2px solid #e0e0e0;">
            <div style="display: flex; justify-content: space-between; font-size: 18px; color: #00ff87; font-weight: bold;">
              <span>Total:</span>
              <span>$${total.toFixed(2)}</span>
            </div>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #f0f8ff; border-radius: 4px;">
            <p style="color: #333; margin: 0 0 10px 0; font-size: 14px;"><strong>Detalles del Pago:</strong></p>
            <p style="color: #666; margin: 5px 0; font-size: 13px;">Método: <strong>${metodoPago}</strong></p>
            <p style="color: #666; margin: 5px 0; font-size: 13px;">Tarjeta: <strong>••••••••••••• ${ultimosDigitos}</strong></p>
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 30px;">Si tienes preguntas sobre tu orden, contacta a nuestro equipo de soporte.</p>
        </div>

        <div style="text-align: center; color: #999; font-size: 11px; margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
          <p>© 2025 GymConnect. Todos los derechos reservados.</p>
          <p>Este es un correo automático, no respondas a este mensaje.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(` Comprobante de compra enviado a: ${email}`);
    return { 
      success: true, 
      messageId: info.messageId 
    };
  } catch (error) {
    console.error(' Error enviando comprobante:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export default transporter;