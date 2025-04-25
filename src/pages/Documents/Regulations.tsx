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

const Regulations = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-10 px-4">

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-2xl md:text-3xl">Положение о конкурсе</CardTitle>
            <CardDescription>
              Официальный документ, регламентирующий порядок проведения конкурса "Лучший двор города Кемерово"
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">1. Общие положения</h2>
              <p className="text-muted-foreground">
                1.1. Конкурс "Лучший двор города Кемерово" (далее - Конкурс) проводится в рамках муниципальной программы по благоустройству городской среды.
              </p>
              <p className="text-muted-foreground mt-2">
                1.2. Настоящее Положение определяет порядок организации и проведения Конкурса, критерии отбора, порядок награждения победителей.
              </p>
              <p className="text-muted-foreground mt-2">
                1.3. Организатором Конкурса является Администрация города Кемерово.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">2. Цели и задачи Конкурса</h2>
              <p className="text-muted-foreground">
                2.1. Цель Конкурса: создание комфортной и благоприятной среды для жителей города путем стимулирования активного участия граждан в благоустройстве дворовых территорий.
              </p>
              <p className="text-muted-foreground mt-2">
                2.2. Задачи Конкурса:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Привлечение внимания жителей к вопросам благоустройства и содержания дворовых территорий;</li>
                <li>Повышение уровня благоустройства дворовых территорий;</li>
                <li>Развитие и реализация творческого потенциала жителей города;</li>
                <li>Выявление и распространение положительного опыта благоустройства дворовых территорий.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">3. Участники Конкурса</h2>
              <p className="text-muted-foreground">
                3.1. В Конкурсе могут принимать участие:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Товарищества собственников жилья;</li>
                <li>Жилищно-строительные кооперативы;</li>
                <li>Советы многоквартирных домов;</li>
                <li>Инициативные группы жителей;</li>
                <li>Управляющие организации.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">4. Порядок и сроки проведения Конкурса</h2>
              <p className="text-muted-foreground">
                4.1. Конкурс проводится ежегодно в период с 1 мая по 15 сентября.
              </p>
              <p className="text-muted-foreground mt-2">
                4.2. Для участия в Конкурсе необходимо подать заявку в электронном виде через официальный сайт Конкурса или в письменном виде в Администрацию города.
              </p>
              <p className="text-muted-foreground mt-2">
                4.3. Заявки принимаются с 1 мая по 15 июня текущего года.
              </p>
              <p className="text-muted-foreground mt-2">
                4.4. Конкурсная комиссия оценивает объекты с 16 июня по 15 августа текущего года.
              </p>
              <p className="text-muted-foreground mt-2">
                4.5. Подведение итогов Конкурса и награждение победителей проводится до 15 сентября текущего года.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">5. Финансирование</h2>
              <p className="text-muted-foreground">
                5.1. Финансирование Конкурса осуществляется за счет средств муниципального бюджета.
              </p>
              <p className="text-muted-foreground mt-2">
                5.2. Призовой фонд Конкурса составляет 3 000 000 рублей и распределяется между победителями согласно решению конкурсной комиссии.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Regulations;