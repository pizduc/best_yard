
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
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
    { text: 'Контакты', href: '#contact' },
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-serif font-semibold tracking-tight">
            Лучший двор
          </span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            Кемерово
          </span>
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {link.text}
            </a>
          ))}
          <a 
            href="#participation" 
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-md hover:-translate-y-0.5"
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
        'md:hidden fixed top-[68px] left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg transition-all transform',
        mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}>
        <nav className="flex flex-col gap-2 p-6">
          {navLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href}
              className="text-foreground/80 hover:text-primary py-3 border-b border-muted transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.text}
            </a>
          ))}
          <a 
            href="#participation" 
            className="bg-primary text-white px-4 py-3 rounded-md text-center mt-4 hover:bg-primary/90 transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            Участвовать
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
