
import { useState } from 'react';
import { ArrowRight, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

type Project = {
  id: number;
  title: string;
  address: string;
  description: string;
  image: string;
  year: number;
  isWinner?: boolean;
};

const ProjectShowcase = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  
  const years = [2023, 2022, 2021, 2020];
  
  const projects: Project[] = [
    {
      id: 1,
      title: 'Зеленый оазис',
      address: 'ул. Весенняя, 28',
      description: 'Комплексное озеленение с созданием зон отдыха и детской площадки, установкой скамеек и освещения.',
      image: 'https://images.unsplash.com/photo-1556800572-1b8aeef2c54f',
      year: 2023,
      isWinner: true
    },
    {
      id: 2,
      title: 'Спортивный двор',
      address: 'пр. Ленина, 45',
      description: 'Создание спортивной площадки с тренажерами, обновление дорожек и установка новых лавочек.',
      image: 'https://images.unsplash.com/photo-1572807348611-d947f87e5e1a',
      year: 2023
    },
    {
      id: 3,
      title: 'Уютный квартал',
      address: 'ул. Красная, 12',
      description: 'Обновление детской площадки, установка беседок и создание зоны для барбекю.',
      image: 'https://images.unsplash.com/photo-1558474798-9579d527b4d7',
      year: 2023
    },
    {
      id: 4,
      title: 'Цветущий двор',
      address: 'ул. Строителей, 7',
      description: 'Создание ландшафтных композиций, обновление дорожек и установка современного освещения.',
      image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
      year: 2022,
      isWinner: true
    },
    {
      id: 5,
      title: 'Семейный уголок',
      address: 'ул. Гагарина, 34',
      description: 'Создание зон отдыха для разных возрастов, установка игровых элементов и озеленение территории.',
      image: 'https://images.unsplash.com/photo-1622963931881-8b505d4c5cf6',
      year: 2022
    },
    {
      id: 6,
      title: 'Экодвор',
      address: 'пр. Шахтеров, 19',
      description: 'Применение экологичных материалов, создание вертикального озеленения и точек раздельного сбора мусора.',
      image: 'https://images.unsplash.com/photo-1493246318656-5bfd4cfb29b8',
      year: 2021,
      isWinner: true
    }
  ];
  
  const filteredProjects = projects.filter(project => project.year === selectedYear);

  return (
    <section id="projects" className="py-24 bg-secondary/30">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-up">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            Проекты
          </span>
          
          <h2 className="text-3xl md:text-4xl font-bold mt-4">
            Реализованные проекты по благоустройству
          </h2>
          
          <p className="text-lg text-muted-foreground mt-4">
            Ознакомьтесь с проектами, которые уже преобразили дворы города Кемерово 
            и сделали их более комфортными для жителей
          </p>
        </div>
        
        {/* Year filter */}
        <div className="flex justify-center mb-12 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  selectedYear === year 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                )}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
        
        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group animate-fade-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="relative h-64 overflow-hidden image-shine">
                <img 
                  src={`${project.image}?w=600&h=400&fit=crop`} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {project.isWinner && (
                  <div className="absolute top-4 right-4 bg-primary text-white rounded-full py-1 px-3 flex items-center gap-1 text-sm shadow-md">
                    <Award size={16} />
                    <span>Победитель</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="text-sm text-muted-foreground mb-2">
                  {project.address}
                </div>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {project.description}
                </p>
                <a
                  href={`#project-${project.id}`}
                  className="mt-4 inline-flex items-center text-primary font-medium group-hover:underline"
                >
                  Подробнее
                  <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="#participation" 
            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Подать свой проект
            <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;
