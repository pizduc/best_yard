import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const ParticipationRules = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-10 px-4">

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-2xl md:text-3xl">Правила участия</CardTitle>
            <CardDescription>
              Подробная информация о том, как принять участие в конкурсе "Лучший двор города Кемерово"
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Кто может участвовать</h2>
              <p className="text-muted-foreground">
                В конкурсе могут принимать участие товарищества собственников жилья, жилищно-строительные кооперативы, советы многоквартирных домов, инициативные группы жителей и управляющие организации, обслуживающие многоквартирные дома на территории города Кемерово.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Этапы участия в конкурсе</h2>
              <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Подготовка и подача заявки</strong>
                  <p className="mt-1">Заполните электронную форму заявки на сайте или подайте бумажную заявку в Администрацию города. К заявке необходимо приложить фотографии двора, план благоустройства и описание проекта.</p>
                </li>
                <li>
                  <strong className="text-foreground">Реализация проекта</strong>
                  <p className="mt-1">Проведите работы по благоустройству двора согласно представленному плану. Работы можно проводить с привлечением жителей дома, управляющей компании или подрядных организаций.</p>
                </li>
                <li>
                  <strong className="text-foreground">Подготовка отчета</strong>
                  <p className="mt-1">После завершения работ подготовьте отчет с фотографиями "до" и "после", описанием выполненных работ и достигнутых результатов.</p>
                </li>
                <li>
                  <strong className="text-foreground">Представление результатов</strong>
                  <p className="mt-1">Представьте результаты работы конкурсной комиссии в ходе осмотра территории. Будьте готовы ответить на вопросы комиссии.</p>
                </li>
              </ol>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Требования к заявке</h2>
              <p className="text-muted-foreground">
                Заявка на участие в конкурсе должна содержать:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Информацию о заявителе (наименование организации/инициативной группы, ФИО контактного лица, контактный телефон, email);</li>
                <li>Адрес дворовой территории;</li>
                <li>Подробное описание планируемых работ по благоустройству;</li>
                <li>План-схему благоустройства территории;</li>
                <li>Фотографии текущего состояния дворовой территории (не менее 5 фотографий);</li>
                <li>Информацию о количестве жителей, планирующих принять участие в работах по благоустройству;</li>
                <li>Предполагаемые сроки проведения работ.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Сроки проведения</h2>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Прием заявок:</strong> с 1 мая по 15 июня 2023 года</li>
                <li><strong className="text-foreground">Реализация проектов:</strong> с 16 июня по 15 августа 2023 года</li>
                <li><strong className="text-foreground">Работа конкурсной комиссии:</strong> с 16 августа по 31 августа 2023 года</li>
                <li><strong className="text-foreground">Подведение итогов:</strong> до 15 сентября 2023 года</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Консультации и поддержка</h2>
              <p className="text-muted-foreground">
                По всем вопросам участия в конкурсе вы можете обратиться в Оргкомитет конкурса:
              </p>
              <ul className="list-none space-y-2 mt-2 text-muted-foreground">
                <li><strong className="text-foreground">Телефон:</strong> +7 (3842) 45-XX-XX</li>
                <li><strong className="text-foreground">Email:</strong> dvorkemerovo@example.com</li>
                <li><strong className="text-foreground">Адрес:</strong> г. Кемерово, пр. Советский, 54</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Участники конкурса могут получить консультации по вопросам благоустройства дворовых территорий у специалистов Управления городского развития.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ParticipationRules;