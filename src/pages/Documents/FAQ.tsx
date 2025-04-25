import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-10 px-4">

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-2xl md:text-3xl">Часто задаваемые вопросы</CardTitle>
            <CardDescription>
              Ответы на популярные вопросы о конкурсе "Лучший двор города Кемерово"
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-medium">
                  Кто может принять участие в конкурсе?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    В конкурсе могут принимать участие товарищества собственников жилья, жилищно-строительные кооперативы, советы многоквартирных домов, инициативные группы жителей и управляющие организации, обслуживающие многоквартирные дома на территории города Кемерово.
                  </p>
                  <p className="mt-2">
                    Для участия достаточно подать заявку в установленный срок и приступить к благоустройству дворовой территории согласно представленному плану.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-medium">
                  Какие документы нужны для участия?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>Для участия в конкурсе необходимо предоставить следующие документы:</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Заявка на участие по установленной форме;</li>
                    <li>План-схема благоустройства территории;</li>
                    <li>Фотографии текущего состояния дворовой территории (не менее 5 фотографий);</li>
                    <li>Протокол общего собрания собственников помещений в многоквартирном доме (для ТСЖ, ЖСК, советов домов);</li>
                    <li>Согласие собственников на проведение работ по благоустройству.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-medium">
                  Каковы сроки проведения конкурса?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>Конкурс проводится ежегодно в период с 1 мая по 15 сентября. Основные этапы:</p>
                  <ul className="list-none mt-2">
                    <li><strong>Прием заявок:</strong> с 1 мая по 15 июня</li>
                    <li><strong>Реализация проектов:</strong> с 16 июня по 15 августа</li>
                    <li><strong>Работа конкурсной комиссии:</strong> с 16 августа по 31 августа</li>
                    <li><strong>Подведение итогов:</strong> до 15 сентября</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-medium">
                  Можно ли получить финансирование на реализацию проекта?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    Конкурс не предусматривает предварительное финансирование проектов. Участники самостоятельно организуют и финансируют работы по благоустройству дворовой территории. 
                  </p>
                  <p className="mt-2">
                    Победители конкурса получают денежные призы, которые могут быть использованы для дальнейшего благоустройства территории или компенсации уже понесенных затрат.
                  </p>
                  <p className="mt-2">
                    Также участники могут привлекать средства из других источников: гранты, спонсорская помощь, средства, выделяемые по программе "Формирование комфортной городской среды" и т.д.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-medium">
                  Какой призовой фонд у конкурса?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    Общий призовой фонд конкурса составляет 3 000 000 рублей и распределяется между победителями согласно решению конкурсной комиссии.
                  </p>
                  <p className="mt-2">
                    Призы распределяются по следующим номинациям:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>"Лучший двор многоквартирного дома" - 1 000 000 рублей;</li>
                    <li>"Лучшая дворовая территория для детей" - 500 000 рублей;</li>
                    <li>"Лучший двор для отдыха и досуга" - 500 000 рублей;</li>
                    <li>"Лучшее озеленение двора" - 500 000 рублей;</li>
                    <li>"Лучший двор в номинации "Народное признание" - 500 000 рублей.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-medium">
                  Как происходит оценка проектов?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    Оценка проектов осуществляется конкурсной комиссией в ходе выездных проверок дворовых территорий. Комиссия оценивает каждый проект по установленным критериям, выставляя баллы от 0 до 100.
                  </p>
                  <p className="mt-2">
                    Основные критерии оценки:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Комплексность благоустройства (0-20 баллов);</li>
                    <li>Эстетическое оформление (0-15 баллов);</li>
                    <li>Озеленение (0-15 баллов);</li>
                    <li>Вовлеченность жителей (0-15 баллов);</li>
                    <li>Инновационность (0-10 баллов);</li>
                    <li>Функциональность (0-10 баллов);</li>
                    <li>Безопасность (0-10 баллов);</li>
                    <li>Соотношение "затраты/результат" (0-5 баллов).</li>
                  </ul>
                  <p className="mt-2">
                    Подробное описание критериев оценки можно найти в разделе "Критерии оценки".
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg font-medium">
                  Можно ли участвовать в конкурсе несколько раз?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    Да, можно участвовать в конкурсе ежегодно. Однако, если ваш двор уже был признан победителем в одной из номинаций, в течение 3 лет вы можете участвовать только в других номинациях.
                  </p>
                  <p className="mt-2">
                    Это правило введено для того, чтобы дать возможность большему числу дворовых территорий получить финансирование на благоустройство.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-lg font-medium">
                  Куда обращаться с вопросами по конкурсу?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>
                    По всем вопросам, связанным с конкурсом, можно обращаться в Оргкомитет:
                  </p>
                  <ul className="list-none mt-2">
                    <li><strong>Телефон:</strong> +7 (3842) 45-XX-XX</li>
                    <li><strong>Email:</strong> dvorkemerovo@example.com</li>
                    <li><strong>Адрес:</strong> г. Кемерово, пр. Советский, 54, каб. 310</li>
                    <li><strong>Время работы:</strong> пн-пт с 9:00 до 17:00</li>
                  </ul>
                  <p className="mt-2">
                    Также вы можете задать вопросы через форму обратной связи на нашем сайте в разделе "Контакты".
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
