import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import sequelize from './config/initbd.js';
import User from './models/User.js';
import Role from './models/Role.js';
import Class from './models/Class.js';
import Product from './models/Product.js';
import bcrypt from 'bcrypt';

const PORT = process.env.PORT || 5000;

const crearClasesDeEjemplo = async () => {
  try {
    const clasesCount = await Class.count();
    
    if (clasesCount === 0) {
      console.log(' Creando clases de ejemplo...');
      
      await Class.bulkCreate([
        {
          id: 1,
          nombre: 'Yoga Principiantes',
          descripcion: 'Introducción al yoga con posturas básicas',
          imagen: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop',
          fecha: 'Lunes 10:00 AM',
          duracion: 60,
          disponibles: 20,
          activa: true
        },
        {
          id: 2,
          nombre: 'Pilates Avanzado',
          descripcion: 'Fortalecimiento del core con pilates',
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDPosS7QwcGsZ43SogZC-TxJ2yPXkYvm108w&s',
          fecha: 'Martes 18:00 PM',
          duracion: 50,
          disponibles: 15,
          activa: true
        },
        {
          id: 3,
          nombre: 'CrossFit',
          descripcion: 'Entrenamiento funcional de alta intensidad',
          imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop',
          fecha: 'Miércoles 19:00 PM',
          duracion: 60,
          disponibles: 10,
          activa: true
        },
        {
          id: 4,
          nombre: 'Boxeo',
          descripcion: 'Técnicas básicas y combinaciones de boxeo',
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK3ru-QjMoBInypSMyV6LGMBcjTmqOxM3-zg&s',
          fecha: 'Jueves 17:30 PM',
          duracion: 45,
          disponibles: 12,
          activa: true
        },
        {
          id: 5,
          nombre: 'Spinning',
          descripcion: 'Ciclismo indoor de alta energía',
          imagen: 'https://i.blogs.es/f7460a/1/1366_2000.jpg',
          fecha: 'Viernes 18:00 PM',
          duracion: 45,
          disponibles: 18,
          activa: true
        },
        {
          id: 6,
          nombre: 'Zumba',
          descripcion: 'Baile y fitness con música latina',
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMFHAy6cGkMehLZCAvZ1KV7j6ldGnDJiM-pg&s',
          fecha: 'Sábado 10:00 AM',
          duracion: 50,
          disponibles: 25,
          activa: true
        },
        {
          id: 7,
          nombre: 'Jiu-Jitsu Principiantes',
          descripcion: 'Técnicas básicas de Jiu-Jitsu Brasileño',
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcBZsPLS70Ec4wniBlGp8DxhATH0JScOusHA&s',
          fecha: 'Lunes 19:00 PM',
          duracion: 60,
          disponibles: 8,
          activa: true
        },
        {
          id: 8,
          nombre: 'Muay Thai',
          descripcion: 'Arte marcial tailandés y defensa personal',
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr-sn3b6Lm3AQZDk2N6cpV-EDoySkKST8utw&s',
          fecha: 'Miércoles 17:00 PM',
          duracion: 60,
          disponibles: 14,
          activa: true
        },
        {
          id: 9,
          nombre: 'Aeróbica',
          descripcion: 'Ejercicio cardiovascular dinámico',
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv9KlvWFpFI12sNZMHh-B4qzvUbUbSeprrOw&s',
          fecha: 'Jueves 10:00 AM',
          duracion: 45,
          disponibles: 20,
          activa: true
        },
        {
          id: 10,
          nombre: 'Funcional',
          descripcion: 'Entrenamiento con movimientos naturales',
          imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop',
          fecha: 'Viernes 19:00 PM',
          duracion: 50,
          disponibles: 15,
          activa: true
        },
        {
          id: 11,
          nombre: 'Pilates Mat',
          descripcion: 'Pilates en colchoneta sin máquinas',
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDPosS7QwcGsZ43SogZC-TxJ2yPXkYvm108w&s',
          fecha: 'Sábado 14:00 PM',
          duracion: 50,
          disponibles: 18,
          activa: true
        },
        {
          id: 12,
          nombre: 'Fuerza y Resistencia',
          descripcion: 'Pesas y musculación progresiva',
          imagen: 'https://media.gq.com.mx/photos/5fa475be6c551485f99e314e/16:9/w_2560%2Cc_limit/GettyImages-961178884-pesa%2520rusa.jpg',
          fecha: 'Lunes 18:00 PM',
          duracion: 60,
          disponibles: 11,
          activa: true
        },
        {
          id: 13,
          nombre: 'Stretching y Flexibilidad',
          descripcion: 'Aumento de flexibilidad y relajación',
          imagen: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop',
          fecha: 'Domingo 16:00 PM',
          duracion: 40,
          disponibles: 22,
          activa: true
        }
      ]);
      
    } else {
    }
  } catch (error) {
    console.error(' Error creando clases:', error);
  }
};
await crearClasesDeEjemplo();



const crearProductosDeEjemplo = async () => {
  try {
    const productosCount = await Product.count();
    
    if (productosCount === 0) {
      console.log(' Creando productos de ejemplo...');
      
      await Product.bulkCreate([
        // Clases
        { id: 1, nombre: 'Clase Privada', precio: 50, imagen: 'https://media.tenor.com/sNB-srHLQPwAAAAM/monkey.gif', categoria: 'Clases', descripcion: 'Sesión 1 a 1', stock: 100 },
        { id: 2, nombre: 'Pack 5 Clases', precio: 200, imagen: 'https://i.pinimg.com/originals/a2/dd/42/a2dd42757edda5a2e6387bce2c1d3e17.jpg', categoria: 'Clases', descripcion: 'Descuento 20%', stock: 100 },
        { id: 3, nombre: 'Pack 10 Clases', precio: 350, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyNjcXLRqGPUn9qXipWyPCZoEeDjlkzwSPJljE-HBy7Si556HrY8LenDUVLOZD0JtP7q8&usqp=CAU', categoria: 'Clases', descripcion: 'Descuento 30%', stock: 100 },
        { id: 4, nombre: 'Membresía Mensual', precio: 100, imagen: 'https://assets.stickerswiki.app/s/mrincreibleperturbado_toto_cl_by_fstikbot/fc26c0b4.thumb.webp', categoria: 'Clases', descripcion: 'Acceso ilimitado', stock: 100 },
        
        // Equipamiento
        { id: 5, nombre: 'Colchoneta', precio: 30, imagen: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200&h=150&fit=crop', categoria: 'Equipamiento', descripcion: 'Para ejercicios', stock: 50 },
        { id: 6, nombre: 'Mancuernas Set', precio: 80, imagen: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=200&h=150&fit=crop', categoria: 'Equipamiento', descripcion: '1-10kg', stock: 30 },
        { id: 7, nombre: 'Banda Elástica', precio: 15, imagen: 'https://cdn.prod.website-files.com/62d7d2c09b7ee7b59c86ea90/647772306ee3d4706c28674a_feliz-mujer-musculosa-haciendo-ejercicio-banda-resistencia-casa.webp', categoria: 'Equipamiento', descripcion: 'Set de 3', stock: 40 },
        { id: 8, nombre: 'Cuerda para Saltar PRIME', precio: 25, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_J8PwUjH5xTgpw5hgpoj0Ry_yJLf8lQ-KjQ&s', categoria: 'Equipamiento', descripcion: 'Profesional', stock: 35 },
        
        // Nutrición
        { id: 9, nombre: 'Proteína Whey', precio: 45, imagen: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=150&fit=crop', categoria: 'Nutrición', descripcion: '1kg', stock: 25 },
        { id: 10, nombre: 'BCAA', precio: 35, imagen: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=150&fit=crop', categoria: 'Nutrición', descripcion: '300g', stock: 30 },
        { id: 11, nombre: 'Creatina Monohidrato', precio: 40, imagen: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=150&fit=crop', categoria: 'Nutrición', descripcion: '500g', stock: 20 },
        { id: 12, nombre: 'Barras Proteicas', precio: 20, imagen: 'https://www.clarin.com/2018/11/13/0dvuOB2OA_0x750__1.jpg', categoria: 'Nutrición', descripcion: 'Pack de 6', stock: 60 },
        
        // Accesorios
        { id: 13, nombre: 'Botella Deportiva', precio: 18, imagen: 'https://cdn.clarosports.com/clarosports/2024/01/sin-titulo-2024-01-10t143530.096-143429.jpg', categoria: 'Accesorios', descripcion: '1L', stock: 45 },
        { id: 14, nombre: 'Toalla Gym', precio: 12, imagen: 'https://st.depositphotos.com/1765681/1339/i/950/depositphotos_13394367-stock-photo-wet-muscular-man-wrapped-in.jpg', categoria: 'Accesorios', descripcion: 'Microfibra', stock: 55 },
        { id: 15, nombre: 'Reloj Deportivo', precio: 60, imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=150&fit=crop', categoria: 'Accesorios', descripcion: 'Con monitor', stock: 15 },
        { id: 16, nombre: 'Mochila Deportiva', precio: 55, imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=150&fit=crop', categoria: 'Accesorios', descripcion: 'Impermeable', stock: 20 }
      ]);
      
    } else {
      console.log(' Ya existen productos en la base de datos');
    }
  } catch (error) {
    console.error(' Error creando productos:', error);
  }
};
await crearProductosDeEjemplo();

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a SQLite...');
  
    await sequelize.sync(); 

    // Crear roles si no existen
    await Role.findOrCreate({
      where: { nombre: 'cliente' },
      defaults: { descripcion: 'Rol de cliente' }
    });

    await Role.findOrCreate({
      where: { nombre: 'profesor' },
      defaults: { descripcion: 'Rol de profesor' }
    });

    await Role.findOrCreate({
      where: { nombre: 'admin' },
      defaults: { descripcion: 'Rol de administrador' }
    });

    const adminExistente = await User.findOne({ 
      where: { email: 'admin@gymconnect.com' } 
    });

    if (!adminExistente) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.create({
        nombre: 'Admin GymConnect',
        email: 'admin@gymconnect.com',
        password: hashedPassword,
        rol: 'admin',
        estado: true
      });
    } else {
      console.log(' Usuario admin ya existe');
    }

  

    console.log('\n==================================================');
    console.log(' CREDENCIALES DE PRUEBA:');
    console.log(' Email: admin@gymconnect.com');
    console.log(' Contraseña: admin123');
    console.log('==================================================\n');

    app.listen(PORT, () => {
      console.log(` Servidor GymConnect escuchando en http://localhost:${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(' CORS habilitado');
    });
  } catch (error) {
    console.error(' Error inicializando:', error);
    
    try {
      await sequelize.sync({ force: false });
      console.log(' Tablas sincronizadas (modo seguro)');
    } catch (secondError) {
      console.error(' Error en sincronización segura:', secondError.message);
      process.exit(1);
    }
  }
};

initDB();