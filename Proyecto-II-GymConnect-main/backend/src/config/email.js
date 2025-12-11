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

export default transporter;