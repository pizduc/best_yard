import { ArrowDown, ArrowRight } from 'lucide-react';
const Hero = () => {
  return <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-white -z-10 animate-gradient-animation"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30 -z-10"></div>
      
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        {[...Array(6)].map((_, i) => <div key={i} className="absolute rounded-full bg-gradient-primary opacity-10 animate-float" style={{
        width: `${Math.random() * 100 + 50}px`,
        height: `${Math.random() * 100 + 50}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 10 + 10}s`
      }}></div>)}
      </div>

      <div className="section-container flex flex-col items-center text-center relative z-10">
        <div className="space-y-8 max-w-3xl mx-auto animate-fade-up">
          <span className="inline-block bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-medium shadow-sm">
            Конкурс благоустройства
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
            Лучший двор <br />
            <span className="text-gradient">города Кемерово</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Программа по благоустройству и развитию городских пространств, направленная на создание комфортной среды для жителей
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 items-center justify-center mt-8">
            <a href="#about" className="bg-gradient-primary text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-soft hover:-translate-y-1 transition-all w-full sm:w-auto btn-hover-effect">
              Подробнее
            </a>
            <a href="#participation" className="backdrop-blur-card text-primary border border-primary/20 px-8 py-3.5 rounded-lg font-medium hover:bg-primary/5 transition-all hover:shadow-sm w-full sm:w-auto flex items-center justify-center gap-2">
              Принять участие
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
        
        {/* Scroll indicator - moved lower */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className="flex flex-col items-center text-primary/80 hover:text-primary transition-colors group">
            
            
          </a>
        </div>
      </div>
    </section>;
};
export default Hero;