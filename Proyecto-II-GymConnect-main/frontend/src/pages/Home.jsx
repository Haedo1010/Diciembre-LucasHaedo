// frontend/src/pages/Home.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCard, setActiveCard] = useState(null);

  const carouselSlides = [
    {
      id: 1,
      title: "Bienvenido a GymConnect",
      subtitle: "Tu gimnasio, tu ritmo",
      description: "Descubre una nueva forma de entrenar con tecnología y profesionales",
      image: "https://linkspaces.co.uk/wp-content/uploads/2024/05/gb-botanica-gym-link-spaces-slough-1024x683.jpg",
    },
    {
      id: 2,
      title: "Clases Grupales",
      subtitle: "Entrena en comunidad",
      description: "Boxeo, Yoga, Funcional y más - Encuentra tu clase ideal",
      image: "https://d30gl8nkrjm6kp.cloudfront.net/wp/2022/08/piloxing-pilates-boxeo-2-1024x576.jpg",
    },
    {
      id: 3,
      title: "Instructores Certificados",
      subtitle: "Expertos en movimiento",
      description: "Profesionales dedicados a ayudarte a alcanzar tus metas",
      image: "https://d30gl8nkrjm6kp.cloudfront.net/articulos/articulos-348492.jpg",
    },
    {
      id: 4,
      title: "Equipamiento Moderno",
      subtitle: "Tecnología de punta",
      description: "Las mejores máquinas y espacios para tu entrenamiento",
      image: "https://entrenadorpersonalpedrolopez.com/wp-content/uploads/2020/04/entrenamiento-funcional.jpg",
    },
    {
      id: 5,
      title: "Horarios Flexibles",
      subtitle: "Entrena cuando quieras",
      description: "Clases disponibles de lunes a domingo en múltiples horarios",
      image: "https://s3.abcstatics.com/media/bienestar/2020/10/14/entrenamiento-funcional-kR5--1248x698@abc.jpeg",
    }
  ];

  const activities = [
    {
      id: 1,
      name: "Boxeo",
      image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop",
      benefits: [
        "Mejora la coordinación y reflejos",
        "Quema hasta 800 calorías por sesión",
        "Aumenta la confianza y disciplina",
        "Fortalece todo el cuerpo"
      ]
    },
    {
      id: 2,
      name: "Jiu Jitsu",
      image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&h=400&fit=crop",
      benefits: [
        "Desarrolla defensa personal efectiva",
        "Mejora flexibilidad y resistencia",
        "Fortalece la mente y concentración",
        "Ideal para todas las edades"
      ]
    },
    {
      id: 3,
      name: "Funcional",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop",
      benefits: [
        "Mejora fuerza y resistencia",
        "Ejercicios para el día a día",
        "Previene lesiones",
        "Quema grasa eficientemente"
      ]
    },
    {
      id: 4,
      name: "Yoga",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
      benefits: [
        "Reduce estrés y ansiedad",
        "Aumenta flexibilidad",
        "Mejora postura y equilibrio",
        "Fortalece mente y cuerpo"
      ]
    },
    {
      id: 5,
      name: "Kickboxing",
      image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&h=400&fit=crop",
      benefits: [
        "Cardio de alta intensidad",
        "Tonifica todo el cuerpo",
        "Libera tensiones",
        "Mejora autodefensa"
      ]
    },
    {
      id: 6,
      name: "Pilates",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
      benefits: [
        "Fortalece el core",
        "Mejora postura",
        "Bajo impacto articular",
        "Tonifica músculos profundos"
      ]
    }
  ];

  const weekSchedule = [
    { time: "08:00", mon: "Funcional", tue: "Funcional", wed: "Funcional", thu: "Funcional", fri: "Funcional", sat: "-" },
    { time: "09:00", mon: "Boxeo", tue: "Yoga", wed: "Boxeo", thu: "Yoga", fri: "Boxeo", sat: "Funcional" },
    { time: "10:00", mon: "Pilates", tue: "Kickboxing", wed: "Pilates", thu: "Kickboxing", fri: "Pilates", sat: "Yoga" },
    { time: "17:00", mon: "Funcional", tue: "Jiu Jitsu", wed: "Funcional", thu: "Jiu Jitsu", fri: "Funcional", sat: "Boxeo" },
    { time: "18:00", mon: "Boxeo", tue: "Funcional", wed: "Boxeo", thu: "Funcional", fri: "Boxeo", sat: "Pilates" },
    { time: "19:00", mon: "Yoga", tue: "Pilates", wed: "Kickboxing", thu: "Pilates", fri: "Yoga", sat: "-" },
    { time: "20:00", mon: "Kickboxing", tue: "Boxeo", wed: "Jiu Jitsu", thu: "Boxeo", fri: "Kickboxing", sat: "-" }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  const toggleCard = (id) => {
    setActiveCard(activeCard === id ? null : id);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(22, 22, 22, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '1rem 0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        borderBottom: '1px solid #2a2a2a'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>GymConnect</h2>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
              color: '#0a0a0a',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
              boxShadow: '0 0 20px rgba(0, 255, 135, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Iniciar Sesión
          </button>
        </div>
      </header>

      {/* Hero Carousel */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', marginTop: 0 }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: index === currentSlide ? 1 : 0,
                // fondo con imagen dinámica + gradiente overlay
                backgroundImage: `
                  linear-gradient(to right, rgba(15,20,32,0.75), rgba(10,10,15,0.3)),
                  url(${slide.image})
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                flexDirection: 'row'
              }}
            >
              
              <div style={{ textAlign: 'center', color: 'white', maxWidth: '800px', padding: '2rem' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: 'bold', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)' }}>{slide.title}</h1>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.95 }}>{slide.subtitle}</h3>
                <p style={{ fontSize: '1.3rem', marginBottom: '2rem', opacity: 0.9 }}>{slide.description}</p>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    background: 'white',
                    color: '#333',
                    border: 'none',
                    padding: '1.2rem 3rem',
                    borderRadius: '30px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px) scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0) scale(1)'}
                >
                  Únete Ahora
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={prevSlide} style={{
          position: 'absolute', top: '50%', left: '2rem', transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: 'none',
          width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer',
          fontSize: '2rem', zIndex: 10, transition: 'all 0.3s ease'
        }}>❮</button>

        <button onClick={nextSlide} style={{
          position: 'absolute', top: '50%', right: '2rem', transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.2)', color: 'white', border: 'none',
          width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer',
          fontSize: '2rem', zIndex: 10, transition: 'all 0.3s ease'
        }}>❯</button>

        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '0.8rem', zIndex: 10
        }}>
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '14px', height: '14px', borderRadius: '50%',
                border: '2px solid white',
                background: index === currentSlide ? 'white' : 'transparent',
                cursor: 'pointer', transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </section>

      {/* Activities Section */}
      <section style={{ padding: '5rem 0', background: '#161616' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{
            textAlign: 'center', fontSize: '3rem', marginBottom: '3rem', fontWeight: 'bold',
            background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>Nuestras Actividades</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {activities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => toggleCard(activity.id)}
                style={{
                  background: '#1f1f1f',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: activeCard === activity.id ? '0 15px 40px rgba(0, 255, 135, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.4)',
                  border: activeCard === activity.id ? '2px solid #00ff87' : '1px solid #2a2a2a',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  transform: activeCard === activity.id ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)'
                }}
              >
                <div style={{
                  height: activeCard === activity.id ? '300px' : '250px',
                  backgroundImage: `url(${activity.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  transition: 'all 0.4s ease'
                }}>
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent)',
                    padding: '1.5rem', color: 'white'
                  }}>
                    <h3 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 'bold' }}>{activity.name}</h3>
                  </div>
                </div>

                <div style={{
                  padding: activeCard === activity.id ? '1.5rem' : '0',
                  background: '#161616',
                  maxHeight: activeCard === activity.id ? '300px' : '0',
                  overflow: 'hidden',
                  transition: 'all 0.4s ease'
                }}>
                  <h4 style={{ marginBottom: '1rem', color: '#00ff87', fontSize: '1.2rem' }}>Beneficios:</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {activity.benefits.map((benefit, idx) => (
                      <li key={idx} style={{
                        padding: '0.5rem 0', color: '#a0a0a0', fontSize: '0.95rem',
                        borderBottom: idx < activity.benefits.length - 1 ? '1px solid #2a2a2a' : 'none'
                      }}>
                        ✓ {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section style={{ padding: '5rem 0', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{
            textAlign: 'center', fontSize: '3rem', marginBottom: '3rem', fontWeight: 'bold',
            background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>Horarios de Clases</h2>

          <div style={{
            overflowX: 'auto', borderRadius: '1rem', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            background: '#161616', marginBottom: '2rem', border: '1px solid #2a2a2a'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)' }}>
                  {['Hora', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((day) => (
                    <th key={day} style={{ padding: '1.2rem', textAlign: 'center', fontWeight: 'bold', color: '#0a0a0a', fontSize: '1.1rem' }}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weekSchedule.map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #2a2a2a' }}>
                    <td style={{ padding: '1.2rem', textAlign: 'center', fontWeight: 'bold', color: '#00ff87', fontSize: '1.1rem' }}>{row.time}</td>
                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => (
                      <td key={day} style={{ padding: '1.2rem', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '20px',
                          background: row[day] !== '-' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                          color: row[day] !== '-' ? 'white' : '#666', fontWeight: '600', fontSize: '0.9rem'
                        }}>{row[day]}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(135deg, #00ff87 0%, #60efff 100%)',
                color: '#0a0a0a', border: 'none', padding: '1rem 2.5rem', borderRadius: '30px',
                fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 255, 135, 0.3)', transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 0 30px rgba(0, 255, 135, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 0 20px rgba(0, 255, 135, 0.3)';
              }}
            >
              Ver Todas las Clases y Reservar
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#161616', color: '#a0a0a0', padding: '2rem 0', textAlign: 'center', borderTop: '1px solid #2a2a2a'
      }}>
        <p style={{ margin: 0, fontSize: '1rem' }}>&copy; 2024 GymConnect. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
