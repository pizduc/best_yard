import { useState } from "react";
import { Check } from "lucide-react";
import axios from "axios";
import InputMask from "react-input-mask";

const ParticipationSection = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
    description: "",
    submitted: false,
    submitting: false,
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [fioSuggestions, setFioSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFioLoading, setIsFioLoading] = useState(false);

  const apiUrl = "https://best-yard.onrender.com/api";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));

    if (name === "address" && value.length > 2) {
      fetchSuggestions(value);
    }

    if (name === "name" && value.length > 2) {
      fetchFioSuggestions(value);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    if (!value.startsWith("+7")) {
      value = "+7 " + value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    setFormState((prev) => ({ ...prev, number: value }));
  };

  const fetchSuggestions = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/suggest`, {
        params: { query, type: "geo" },
      });
      setSuggestions(response.status === 200 ? response.data.suggestions : []);
    } catch (error) {
      console.error("Ошибка при запросе подсказок адреса:", error.response ? error.response.data : error.message);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFioSuggestions = async (query: string) => {
    setIsFioLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/suggest-fio`, {
        params: { query },
      });
      setFioSuggestions(response.status === 200 ? response.data.suggestions.map(s => s.value) : []);
    } catch (error) {
      console.error("Ошибка при запросе подсказок ФИО:", error.response ? error.response.data : error.message);
      setFioSuggestions([]);
    } finally {
      setIsFioLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedNumber = formState.number.replace(/\D/g, ""); // Убираем всё кроме цифр

    if (!formState.name || !formState.email || !formState.number || !formState.address || !formState.description) {
      alert("Все поля должны быть заполнены!");
      return;
    }

    if (cleanedNumber.length !== 11) {
      alert("Пожалуйста, введите корректный номер телефона.");
      return;
    }

    setFormState((prev) => ({ ...prev, submitting: true }));

    try {
      const response = await axios.post(`${apiUrl}/applications`, {
        name: formState.name.trim(),
        email: formState.email.trim(),
        number: cleanedNumber, // Отправляем очищенный номер
        address: formState.address.trim(),
        description: formState.description.trim(),
      });

      if (response.status !== 200) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      setFormState({
        name: "",
        email: "",
        number: "",
        address: "",
        description: "",
        submitted: true,
        submitting: false,
      });
    } catch (error) {
      console.error("Ошибка отправки формы:", error.response ? error.response.data : error.message);
      setFormState((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleSelectAddress = (address: string) => {
    setFormState((prev) => ({ ...prev, address }));
    setSuggestions([]);
  };

  const handleSelectFio = (name: string) => {
    setFormState((prev) => ({ ...prev, name }));
    setFioSuggestions([]);
  };

  return (
    <section id="participation" className="py-24 bg-white">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16">
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
                    {fioSuggestions.length > 0 && !isFioLoading && (
                      <ul className="mt-2 p-2 border border-gray-200 rounded-md">
                        {fioSuggestions.map((fio, index) => (
                          <li
                            key={index}
                            onClick={() => handleSelectFio(fio)}
                            className="cursor-pointer p-2 hover:bg-primary/10"
                          >
                            {fio}
                          </li>
                        ))}
                      </ul>
                    )}
                    {isFioLoading && <p className="mt-2 text-gray-500">Загрузка...</p>}
                  </div>
                  <div>
                    <label htmlFor="number" className="block text-sm font-medium text-foreground mb-1">
                      Телефон *
                    </label>
                    <InputMask
                      mask="+7 (999) 999-99-99"
                      maskChar="_"
                      value={formState.number}
                      onChange={handlePhoneChange}
                    >
                      {(inputProps) => (
                        <input
                          {...inputProps}
                          id="number"
                          name="number"
                          type="tel"
                          required
                          className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="+7 (900) 123-45-67"
                        />
                      )}
                    </InputMask>
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
                  {suggestions.length > 0 && !isLoading && (
                    <ul className="mt-2 p-2 border border-gray-200 rounded-md">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectAddress(suggestion)}
                          className="cursor-pointer p-2 hover:bg-primary/10"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                  {isLoading && <p className="mt-2 text-gray-500">Загрузка...</p>}
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
                  className={`w-full px-6 py-3 text-white font-medium rounded-md transition-all ${formState.submitting ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"}`}
                >
                  {formState.submitting ? "Отправка..." : "Отправить заявку"}
                </button>
              </form>
            )}
          </div>

          {/* Карта */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-300 h-[524px] mt-10">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A50d786139a3bd57a49c7a1a5c71b1c59baa65a84f8c1f22d48bcd3481fc35537&amp;source=constructor"
                width="590"
                height="524"
                frameBorder="0"
                style={{ display: "block", border: "none" }}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticipationSection;
