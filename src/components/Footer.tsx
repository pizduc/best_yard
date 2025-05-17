import { useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  // Функция для прокрутки наверх
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('Scrolling to top');
  };

  // Логируем футер для диагностики
  useEffect(() => {
    const footerElement = document.getElementById('footer');
    if (footerElement) {
      console.log('Footer element found:', footerElement);
    } else {
      console.log('Footer element not found');
    }
  }, []);

  const socialLinks = [
    { name: 'ВКонтакте', href: 'https://vk.com/ali_prokop', icon: 'vk' },
    { name: 'Телеграм', href: 'https://t.me/zxc_ice_latte', icon: 'telegram' },
  ];

  // Функция для прокрутки к футеру
  const scrollToFooter = () => {
    const footerElement = document.getElementById('footer');
    console.log('scrollToFooter triggered');
    if (footerElement) {
      console.log('footerElement found:', footerElement);
      footerElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error('Footer element not found for scroll');
    }
  };

  return (
    <footer id="footer" className="bg-foreground text-white">
      <div className="section-container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4">Лучший двор</h3>
            <p className="text-white/80 mb-6">
              Программа по благоустройству и развитию городских пространств, направленная на создание комфортной среды для жителей Кемерово
            </p>

            <Button
              onClick={scrollToTop}
              variant="ghost"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white hover:bg-white/10 p-0"
            >
              <ArrowUp size={16} />
              Наверх
            </Button>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Разделы сайта</h4>
            <ul className="space-y-2">
              {[{ label: 'Главная', href: '/' }, { label: 'О конкурсе', href: '#about' }, { label: 'Проекты', href: '#projects' }, { label: 'Участие', href: '#participation' }, { label: 'Контакты', href: '#contact' }].map(
                (link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white/70 hover:text-white transition-colors block py-1">
                      {link.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Документы</h4>
            <ul className="space-y-2">
              {[{ label: 'Положение о конкурсе', href: '/documents/regulations' }, { label: 'Правила участия', href: '/documents/participation-rules' }, 
              { label: 'Критерии оценки', href: '/documents/evaluation-criteria' }, { label: 'Часто задаваемые вопросы', href: '/documents/faq' }, 
              { label: 'Политика конфиденциальности', href: '/documents/privacy-policy' }, { label: 'Пользовательское соглашение', href: '/documents/useragreement' }].map(
                (link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white/70 hover:text-white transition-colors block py-1">
                      {link.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/70">
                <span className="inline-block mt-1 opacity-70">📍</span>
                650000, г. Кемерово, ул Терешковой, 35
              </li>
              <li className="flex items-start gap-2 text-white/70">
                <span className="inline-block mt-1 opacity-70">📞</span>
                <a href="tel:+73842123456" className="hover:text-white transition-colors">
                  +7 (3842) 12-34-56
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/70">
                <span className="inline-block mt-1 opacity-70">✉️</span>
                <a href="mailto:info@luchshiydvor.ru" className="hover:text-white transition-colors">
                  info@luchshiydvor.ru
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-sm text-white/70 mb-3">Мы в социальных сетях:</p>
              <div className="flex gap-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label={link.name}
                  >
                    <span className="sr-only">{link.name}</span>
                    {link.icon === 'vk' && <span className="text-lg">VK</span>}
                    {link.icon === 'telegram' && <span className="text-lg">TG</span>}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white/70 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Лучший двор г. Кемерово. Все права защищены.</p>

          <div className="flex flex-wrap gap-6 justify-center">
            <a href="/documents/regulations" className="text-white/70 hover:text-white transition-colors text-sm">
              Условия использования
            </a>
            <a href="/documents/privacy-policy" className="text-white/70 hover:text-white transition-colors text-sm">
              Политика конфиденциальности
            </a>
            <a href="/documents/faq" className="text-white/70 hover:text-white transition-colors text-sm">
              Политика cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
