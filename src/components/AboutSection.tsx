
import { Award, Users, Home, Clock } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Конкурс',
      description: 'Возможность участвовать в городском конкурсе на лучшее благоустройство территории'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Сообщество',
      description: 'Объединение соседей для создания уютной и комфортной среды во дворе'
    },
    {
      icon: <Home className="h-8 w-8 text-primary" />,
      title: 'Благоустройство',
      description: 'Улучшение внешнего вида и функциональности дворовых территорий'
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Устойчивое развитие',
      description: 'Создание долгосрочных проектов, которые будут радовать жителей многие годы'
    }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="section-container">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Content */}
          <div className="flex-1 space-y-6 animate-fade-up">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              О конкурсе
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              Программа развития комфортной городской среды
            </h2>
            
            <p className="text-lg text-muted-foreground">
              «Лучший двор» – это городской конкурс, направленный на благоустройство дворовых территорий и создание комфортных условий для жителей Кемерово. Программа поддерживает инициативы граждан по улучшению городской среды.
            </p>
            
            <div className="space-y-4 pt-4">
              <p className="text-foreground">
                Участвуя в конкурсе, вы получаете:
              </p>
              
              <ul className="space-y-2">
                {[
                  'Финансовую поддержку для реализации проекта',
                  'Консультационную помощь от экспертов в области благоустройства',
                  'Возможность сделать свой двор красивее и комфортнее',
                  'Укрепление добрососедских отношений'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="bg-primary/10 text-primary h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Features grid */}
          <div className="flex-1 grid sm:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="backdrop-blur-card rounded-xl p-6 transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="mb-4 bg-primary/10 h-14 w-14 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
