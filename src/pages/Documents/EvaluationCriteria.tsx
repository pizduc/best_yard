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

const EvaluationCriteria = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-10 px-4">

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-2xl md:text-3xl">Критерии оценки</CardTitle>
            <CardDescription>
              Подробная информация о том, как оцениваются проекты в конкурсе "Лучший двор города Кемерово"
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Общие положения</h2>
              <p className="text-muted-foreground">
                Конкурсная комиссия оценивает представленные проекты по 100-балльной шкале, где каждый критерий имеет свой вес в общей оценке. Победителями становятся проекты, набравшие наибольшее количество баллов в своей номинации.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Основные критерии оценки</h2>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-medium text-lg">1. Комплексность благоустройства (0-20 баллов)</h3>
                  <p className="text-muted-foreground mt-2">
                    Оценивается разнообразие элементов благоустройства и их функциональность, целостность проекта, учет потребностей различных категорий жителей (дети, пожилые люди, маломобильные группы населения).
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-medium text-lg">2. Эстетическое оформление (0-15 баллов)</h3>
                  <p className="text-muted-foreground mt-2">
                    Оценивается художественная выразительность, оригинальность дизайнерских решений, цветовое решение, сочетание различных материалов, гармоничность с окружающей застройкой.
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-medium text-lg">3. Озеленение (0-15 баллов)</h3>
                  <p className="text-muted-foreground mt-2">
                    Оценивается разнообразие и количество зеленых насаждений, наличие цветников, клумб, вертикального озеленения, ухоженность растений, применение современных подходов к озеленению.
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-medium text-lg">4. Вовлеченность жителей (0-15 баллов)</h3>
                  <p className="text-muted-foreground mt-2">
                    Оценивается количество жителей, принявших участие в благоустройстве, их активность, инициативность, организованность, вклад в реализацию проекта.
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-medium text-lg">5. Инновационность (0-10 баллов)</h3>
                  <p className="text-muted-foreground mt-2">
                    Оценивается применение современных материалов, технологий, нестандартных решений в благоустройстве, использование экологичных материалов и энергосберегающих технологий.
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-medium text-lg">6. Функциональность (0-10 баллов)</h3>
                  <p className="text-muted-foreground mt-2">
                    Оценивается удобство использования созданных объектов, их востребованность, доступность для всех категорий граждан, в том числе для маломобильных групп населения.
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-medium text-lg">7. Безопасность (0-10 баллов)</h3>
                  <p className="text-muted-foreground mt-2">
                    Оценивается соответствие созданных объектов требованиям безопасности, наличие необходимого освещения, отсутствие травмоопасных элементов, наличие средств видеонаблюдения.
                  </p>
                </div>
                
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-medium text-lg">8. Соотношение "затраты/результат" (0-5 баллов)</h3>
                  <p className="text-muted-foreground mt-2">
                    Оценивается эффективность использования ресурсов, соответствие полученного результата затраченным средствам, привлечение дополнительных источников финансирования.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Процедура оценки</h2>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Каждый член конкурсной комиссии выставляет баллы по каждому критерию.</li>
                <li>Итоговая оценка проекта определяется как среднее арифметическое оценок всех членов комиссии.</li>
                <li>При равенстве баллов у нескольких проектов преимущество отдается проекту, получившему более высокую оценку по критерию "Комплексность благоустройства".</li>
                <li>Конкурсная комиссия имеет право присуждать дополнительные баллы (до 5 баллов) за особые достижения в благоустройстве или необычные решения.</li>
              </ol>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Дополнительная информация</h2>
              <p className="text-muted-foreground">
                Подробные разъяснения по критериям оценки можно получить в Оргкомитете конкурса. Конкурсная комиссия оставляет за собой право вносить изменения в систему оценки до начала работы комиссии, о чем участники будут уведомлены заранее.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default EvaluationCriteria;