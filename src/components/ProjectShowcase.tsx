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
  link: string; // Добавлено поле для ссылки
};

const ProjectShowcase = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  
  const years = [2024, 2023, 2022, 2021, 2020];
  
  const projects: Project[] = [
    {
      id: 1,
      title: 'ЖК "ЮЖНЫЙ"',
      address: 'ул. Дружбы, 28/4',
      description: 'Комплексное озеленение с созданием зон отдыха и детской площадки, установкой скамеек и освещения.',
      image: 'https://images.cdn-cian.ru/images/6/694/257/yuzhnyy-kemerovo-jk-752496632-6.jpg',
      year: 2023,
      isWinner: true,
      link: 'https://южный-кемерово.рф/', 
    },
    {
      id: 2,
      title: 'ЖК "Чемпион Парк"',
      address: 'ул. Институтская',
      description: 'Создание спортивной площадки с тренажерами, обновление дорожек и установка новых лавочек.',
      image: 'https://avatars.mds.yandex.net/get-altay/10953738/2a0000018bc1d4aef79ca81ad0fde1ee9072/orig',
      year: 2023,
      link: 'https://жк-чемпионпарк.рф/?utm_source=yandex&utm_medium=cpc&utm_campaign=chempion_park_brend&type=search&source=none&block=premium&position=1&campaign=104243768&ad=15617115704&phrase=49227936991&utm_term=жк%20чемпион%20парк&roistat=direct10_search_15617115704_жк%20чемпион%20парк&roistat_referrer=none&roistat_pos=premium_1&yclid=8274315248081567743', 
    },
    {
      id: 3,
      title: 'ЖК "Уютный квартал"',
      address: 'ул. Терешковой',
      description: 'Обновление детской площадки, установка беседок и создание зоны для барбекю.',
      image: 'https://avatars.mds.yandex.net/get-verba/997355/2a000001860d05b0fdde005e14ac9546833f/realty_large_1242',
      year: 2023,
      link: 'https://жк-уютныйквартал.рф/?utm_source=yandex&utm_medium=cpc&utm_campaign=uyutnyj_kvartal_poisk&type=search&source=none&block=premium&position=1&campaign=104199183&ad=15617690785&phrase=49230978119&utm_term=жк%20уютный%20квартал&roistat=direct9_search_15617690785_жк%20уютный%20квартал&roistat_referrer=none&roistat_pos=premium_1&yclid=16019355959853842431', 
    },
    {
      id: 4,
      title: 'ЖК "Парковый"',
      address: 'пр. Молодежный',
      description: 'Создание ландшафтных композиций, обновление дорожек и установка современного освещения.',
      image: 'https://images.cdn-cian.ru/images/parkovyy-kemerovo-jk-2328802522-7.jpg',
      year: 2022,
      isWinner: true,
      link: 'https://жк-парковый.рф/?utm_source=yandex&utm_medium=cpc&utm_medium=cpc&utm_campaign=parkovyj_poisk&utm_content=16900450506&utm_term=---autotargeting&roistat=direct8_search_16900450506_---autotargeting&roistat_referrer=none&roistat_pos=premium_2&yclid=4683006103704829951', 
    },
    {
      id: 5,
      title: 'ЖК "Семейный квартал "Весная""',
      address: 'ул. 1-я Линия',
      description: 'Создание зон отдыха для разных возрастов, установка игровых элементов и озеленение территории.',
      image: 'https://images.cdn-cian.ru/images/semeynyy-kvartal-vesna-kemerovo-jk-2180768028-7.jpg',
      year: 2022,
      link: 'https://наш.дом.рф/сервисы/каталог-новостроек/объект/51059', 
    },
    {
      id: 6,
      title: 'ЖК "Верхний бульвар"',
      address: 'бул. Строителей',
      description: 'Применение экологичных материалов, создание вертикального озеленения и точек раздельного сбора мусора.',
      image: 'https://images.cdn-cian.ru/images/63/667/231/verhniy-bulvar-kemerovo-jk-1327663686-7.jpg',
      year: 2021,
      isWinner: true,
      link: 'https://www.progrand.ru/projects/vb2q/', 
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
                  href={project.link}  // Ссылка на уникальную страницу проекта
                  className="mt-4 inline-flex items-center text-primary font-medium group-hover:underline"
                  target="_blank"  // Открывает в новой вкладке
                  rel="noopener noreferrer"
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
