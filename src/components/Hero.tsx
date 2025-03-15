
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-white -z-10"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxODRFNzciIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30 -z-10"></div>

      <div className="section-container flex flex-col items-center text-center">
        <div className="space-y-6 max-w-3xl mx-auto animate-fade-up">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            Конкурс благоустройства
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
            Лучший двор <br />
            <span className="text-primary">города Кемерово</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Программа по благоустройству и развитию городских пространств, направленная на создание комфортной среды для жителей
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
            <a 
              href="#about" 
              className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Подробнее
            </a>
            <a 
              href="#participation" 
              className="bg-white text-primary border border-primary px-8 py-3 rounded-md font-medium hover:bg-primary/5 transition-all w-full sm:w-auto"
            >
              Принять участие
            </a>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
            <span className="text-sm mb-2">Узнать больше</span>
            <ArrowDown size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
