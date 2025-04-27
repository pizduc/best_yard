import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Award, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { text: 'Главная', href: '/' },
    { text: 'О конкурсе', href: '#about' },
    { text: 'Проекты', href: '#projects' },
    { text: 'Контакты', href: '#footer' }, // Ссылка на футер
  ];

  const handleScrollToFooter = (event, href) => {
    console.log("handleScrollToFooter triggered");
    event.preventDefault();  // Останавливаем стандартное поведение ссылки
    
    // Отложим выполнение на 100 миллисекунд
    setTimeout(() => {
      const footerElement = document.getElementById('footer');
      console.log("footerElement: ", footerElement);
  
      if (footerElement) {
        console.log("Scrolling to footer...");
        footerElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error("Footer element not found");
      }
  
      setMobileMenuOpen(false);
    }, 100); // Задержка в 100 миллисекунд
  };
  

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-soft' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 bg-gradient-primary text-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
            <Award size={24} />
          </div>
          <div>
            <span className="text-xl font-serif font-semibold tracking-tight text-gradient group-hover:opacity-90 transition-opacity">
              Лучший двор
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium ml-2">
              Кемерово
            </span>
          </div>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              onClick={(e) => link.href === '#footer' && handleScrollToFooter(e, link.href)}
            >
              {link.text}
            </a>
          ))}
          <a 
            href="#participation" 
            className="bg-gradient-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:shadow-soft transition-all hover:-translate-y-0.5 btn-hover-effect"
          >
            Участвовать
          </a>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-foreground/80 hover:text-primary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        'md:hidden fixed top-[68px] left-0 right-0 bg-white/95 backdrop-blur-lg shadow-soft transition-all transform',
        mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}>
        <nav className="flex flex-col gap-2 p-6">
          {navLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href}
              className="text-foreground/80 hover:text-primary py-3 border-b border-muted transition-colors"
              onClick={(e) => link.href === '#footer' && handleScrollToFooter(e, link.href)}
            >
              {link.text}
            </a>
          ))}
          <a 
            href="#participation" 
            className="bg-gradient-primary text-white px-4 py-3 rounded-lg text-center mt-4 hover:shadow-soft transition-all flex items-center justify-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Участвовать
            <ChevronDown size={16} className="animate-bounce" />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
