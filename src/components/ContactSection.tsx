
import { useState } from 'react';
import { Check, Map, Phone, Mail, Clock } from 'lucide-react';

const ContactSection = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    submitted: false,
    submitting: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, submitting: true }));
    
    // Simulate form submission
    setTimeout(() => {
      setFormState(prev => ({ 
        ...prev, 
        submitted: true, 
        submitting: false 
      }));
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormState({
          name: '',
          email: '',
          phone: '',
          address: '',
          description: '',
          submitted: false,
          submitting: false
        });
      }, 5000);
    }, 1500);
  };

  return (
    <section id="participation" className="py-24 bg-white">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact form */}
          <div className="animate-fade-up">
            <div className="mb-8">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                Участие в конкурсе
              </span>
              
              <h2 className="text-3xl md:text-4xl font-bold mt-4">
                Подайте заявку на участие
              </h2>
              
              <p className="text-lg text-muted-foreground mt-4">
                Заполните форму ниже, чтобы принять участие в конкурсе и получить шанс преобразить свой двор
              </p>
            </div>
            
            {formState.submitted ? (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-2xl font-semibold">Заявка отправлена!</h3>
                <p className="text-muted-foreground mt-2">
                  Спасибо за ваш интерес к конкурсу. Мы свяжемся с вами в ближайшее время.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                      Ваше имя *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                      Телефон *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="+7 (900) 123-45-67"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    Электронная почта *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="example@mail.ru"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">
                    Адрес двора *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formState.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="г. Кемерово, ул. Примерная, 123"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
                    Описание предлагаемых изменений *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formState.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Опишите ваши идеи по благоустройству двора..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={formState.submitting}
                  className={`w-full px-6 py-3 text-white font-medium rounded-md transition-all ${
                    formState.submitting 
                      ? 'bg-primary/70 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {formState.submitting ? 'Отправка...' : 'Отправить заявку'}
                </button>
              </form>
            )}
          </div>
          
          {/* Contact info */}
          <div className="lg:pt-20 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="backdrop-blur-card rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-semibold mb-6">Контактная информация</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Map size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Адрес</h4>
                    <p className="text-muted-foreground mt-1">
                      650000, г. Кемерово, пр. Советский, 54
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Телефон</h4>
                    <p className="text-muted-foreground mt-1">
                      +7 (3842) 12-34-56
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Электронная почта</h4>
                    <p className="text-muted-foreground mt-1">
                      info@luchshiydvor.ru
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Часы работы</h4>
                    <p className="text-muted-foreground mt-1">
                      Пн-Пт: 9:00 - 18:00<br />
                      Сб-Вс: Выходной
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-muted">
                <h4 className="font-medium text-foreground mb-4">Следите за нами в социальных сетях</h4>
                <div className="flex gap-4">
                  {['ВКонтакте', 'Телеграм', 'Одноклассники'].map((network, index) => (
                    <a 
                      key={index}
                      href="#"
                      className="bg-white border border-muted px-4 py-2 rounded-md text-sm hover:bg-primary hover:text-white hover:border-primary transition-all"
                    >
                      {network}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
