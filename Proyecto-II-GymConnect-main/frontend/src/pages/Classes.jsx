import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ClassCard from '../components/ClassCard';

const Classes = () => {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarClases();
  }, []);

  const cargarClases = () => {
    setClases([
      {
        id: 1,
        nombre: 'Yoga Principiantes',
        descripcion: 'Introducción al yoga con posturas básicas',
        imagen: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop',
        fecha: 'Lunes 10:00 AM',
        duracion: 60,
        disponibles: 20
      },
      {
        id: 2,
        nombre: 'Pilates Avanzado',
        descripcion: 'Fortalecimiento del core con pilates',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDPosS7QwcGsZ43SogZC-TxJ2yPXkYvm108w&s',
        fecha: 'Martes 18:00 PM',
        duracion: 50,
        disponibles: 15
      },
      {
        id: 3,
        nombre: 'CrossFit',
        descripcion: 'Entrenamiento funcional de alta intensidad',
        imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop',
        fecha: 'Miércoles 19:00 PM',
        duracion: 60,
        disponibles: 10
      },
      {
        id: 4,
        nombre: 'Boxeo',
        descripcion: 'Técnicas básicas y combinaciones de boxeo',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK3ru-QjMoBInypSMyV6LGMBcjTmqOxM3-zg&s',
        fecha: 'Jueves 17:30 PM',
        duracion: 45,
        disponibles: 12
      },
      {
        id: 5,
        nombre: 'Spinning',
        descripcion: 'Ciclismo indoor de alta energía',
        imagen: 'https://i.blogs.es/f7460a/1/1366_2000.jpg',
        fecha: 'Viernes 18:00 PM',
        duracion: 45,
        disponibles: 18
      },
      {
        id: 6,
        nombre: 'Zumba',
        descripcion: 'Baile y fitness con música latina, solo señoras hot',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMFHAy6cGkMehLZCAvZ1KV7j6ldGnDJiM-pg&s',
        fecha: 'Sábado 10:00 AM',
        duracion: 50,
        disponibles: 25
      },
      {
        id: 7,
        nombre: 'Jiu-Jitsu Principiantes',
        descripcion: 'Técnicas básicas de Jiu-Jitsu Brasileño',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcBZsPLS70Ec4wniBlGp8DxhATH0JScOusHA&s',
        fecha: 'Lunes 19:00 PM',
        duracion: 60,
        disponibles: 8
      },
      {
        id: 8,
        nombre: 'Muay Thai',
        descripcion: 'Arte marcial tailandés y defensa personal',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr-sn3b6Lm3AQZDk2N6cpV-EDoySkKST8utw&s',
        fecha: 'Miércoles 17:00 PM',
        duracion: 60,
        disponibles: 14
      },
      {
        id: 9,
        nombre: 'Aeróbica',
        descripcion: 'Ejercicio cardiovascular dinámico',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv9KlvWFpFI12sNZMHh-B4qzvUbUbSeprrOw&s',
        fecha: 'Jueves 10:00 AM',
        duracion: 45,
        disponibles: 20
      },
      {
        id: 10,
        nombre: 'Funcional',
        descripcion: 'Entrenamiento con movimientos naturales',
        imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop',
        fecha: 'Viernes 19:00 PM',
        duracion: 50,
        disponibles: 15
      },
      {
        id: 11,
        nombre: 'Pilates Mat',
        descripcion: 'Pilates en colchoneta sin máquinas',
        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDPosS7QwcGsZ43SogZC-TxJ2yPXkYvm108w&s',
        fecha: 'Sábado 14:00 PM',
        duracion: 50,
        disponibles: 18
      },
      {
        id: 12,
        nombre: 'Fuerza y Resistencia',
        descripcion: 'Pesas y musculación progresiva',
        imagen: 'https://media.gq.com.mx/photos/5fa475be6c551485f99e314e/16:9/w_2560%2Cc_limit/GettyImages-961178884-pesa%2520rusa.jpg',
        fecha: 'Lunes 18:00 PM',
        duracion: 60,
        disponibles: 11
      },
      {
        id: 13,
        nombre: 'Stretching y Flexibilidad',
        descripcion: 'Aumento de flexibilidad y relajación',
        imagen: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop',
        fecha: 'Domingo 16:00 PM',
        duracion: 40,
        disponibles: 22
      }
    ]);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '80px' }}>
      <Navbar />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#00ff87',
          marginBottom: '2rem'
        }}>
          Clases Disponibles
        </h1>

        {loading ? (
          <p style={{ color: '#a0a0a0' }}>Cargando...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {clases.map((clase) => (
              <ClassCard 
                key={clase.id} 
                clase={clase}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;