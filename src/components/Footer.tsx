
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-foreground text-white">
      <div className="section-container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4">Лучший двор</h3>
            <p className="text-white/80 mb-6">
              Программа по благоустройству и развитию городских пространств, направленная на создание комфортной среды для жителей Кемерово
            </p>
            
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <ArrowUp size={16} />
              Наверх
            </button>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Разделы сайта</h4>
            <ul className="space-y-2">
              {[
                { label: 'Главная', href: '/' },
                { label: 'О конкурсе', href: '#about' },
                { label: 'Проекты', href: '#projects' },
                { label: 'Участие', href: '#participation' },
                { label: 'Контакты', href: '#contact' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Документы</h4>
            <ul className="space-y-2">
              {[
                { label: 'Положение о конкурсе', href: '#' },
                { label: 'Правила участия', href: '#' },
                { label: 'Критерии оценки', href: '#' },
                { label: 'Часто задаваемые вопросы', href: '#' },
                { label: 'Политика конфиденциальности', href: '#' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Контакты</h4>
            <ul className="space-y-3">
              {[
                { label: '650000, г. Кемерово, пр. Советский, 54', type: 'address' },
                { label: '+7 (3842) 12-34-56', type: 'phone' },
                { label: 'info@luchshiydvor.ru', type: 'email' }
              ].map((item, index) => (
                <li key={index} className="text-white/70">
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Лучший двор г. Кемерово. Все права защищены.
          </p>
          
          <div className="flex gap-6">
            {['ВКонтакте', 'Телеграм', 'Одноклассники'].map((network, index) => (
              <a 
                key={index}
                href="#"
                className="text-white/70 hover:text-white transition-colors text-sm"
              >
                {network}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
