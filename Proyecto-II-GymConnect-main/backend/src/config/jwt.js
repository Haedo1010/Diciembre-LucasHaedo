import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export const generarToken = (user) => {
  return jwt.sign(
    {
      usuario_id: user.id,
      email: user.email,
      rol: user.rol
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
};

export const verificarToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Token inválido');
  }
};