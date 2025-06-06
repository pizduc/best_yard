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

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-10 px-4">

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-2xl md:text-3xl">Политика конфиденциальности</CardTitle>
            <CardDescription>
              Информация о том, как мы обрабатываем персональные данные участников конкурса "Лучший двор города Кемерово"
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">1. Общие положения</h2>
              <p className="text-muted-foreground">
                1.1. Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных участников конкурса "Лучший двор города Кемерово" (далее - Конкурс).
              </p>
              <p className="text-muted-foreground mt-2">
                1.2. Организатором Конкурса и оператором персональных данных является Администрация города Кемерово (далее - Оператор).
              </p>
              <p className="text-muted-foreground mt-2">
                1.3. Политика разработана в соответствии с требованиями Федерального закона от 27.07.2006 г. № 152-ФЗ "О персональных данных" и определяет принципы, порядок и условия обработки персональных данных участников Конкурса.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">2. Категории обрабатываемых персональных данных</h2>
              <p className="text-muted-foreground">
                2.1. Для участия в Конкурсе и его организации Оператор обрабатывает следующие персональные данные участников:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Фамилия, имя, отчество;</li>
                <li>Контактный телефон;</li>
                <li>Адрес электронной почты;</li>
                <li>Адрес дворовой территории;</li>
                <li>Должность (для представителей юридических лиц);</li>
                <li>Наименование организации (для представителей юридических лиц);</li>
                <li>Фотографии дворовой территории, которые могут содержать изображения участников Конкурса;</li>
                <li>Иные данные, предоставляемые участниками в заявке на участие в Конкурсе.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">3. Цели обработки персональных данных</h2>
              <p className="text-muted-foreground">
                3.1. Оператор обрабатывает персональные данные участников в следующих целях:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Организация и проведение Конкурса;</li>
                <li>Рассмотрение заявок на участие в Конкурсе;</li>
                <li>Определение победителей Конкурса;</li>
                <li>Информирование участников о ходе проведения Конкурса;</li>
                <li>Вручение призов победителям Конкурса;</li>
                <li>Подготовка отчетных материалов о проведении Конкурса;</li>
                <li>Распространение информации о результатах Конкурса, в том числе в средствах массовой информации и сети Интернет.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">4. Принципы обработки персональных данных</h2>
              <p className="text-muted-foreground">
                4.1. Обработка персональных данных осуществляется на основе следующих принципов:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Законности и справедливости обработки персональных данных;</li>
                <li>Ограничения обработки персональных данных достижением конкретных, заранее определенных и законных целей;</li>
                <li>Недопустимости обработки персональных данных, несовместимой с целями сбора персональных данных;</li>
                <li>Недопустимости объединения баз данных, содержащих персональные данные, обработка которых осуществляется в целях, несовместимых между собой;</li>
                <li>Обработки только тех персональных данных, которые отвечают целям их обработки;</li>
                <li>Соответствия содержания и объема обрабатываемых персональных данных заявленным целям обработки;</li>
                <li>Обеспечения точности, достаточности и актуальности персональных данных по отношению к целям их обработки;</li>
                <li>Хранения персональных данных в форме, позволяющей определить субъекта персональных данных, не дольше, чем этого требуют цели обработки персональных данных.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">5. Правовые основания обработки персональных данных</h2>
              <p className="text-muted-foreground">
                5.1. Правовыми основаниями обработки персональных данных являются:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Федеральный закон от 27.07.2006 г. № 152-ФЗ "О персональных данных";</li>
                <li>Согласие субъекта персональных данных на обработку его персональных данных;</li>
                <li>Положение о проведении конкурса "Лучший двор города Кемерово";</li>
                <li>Иные нормативные правовые акты, регулирующие отношения, связанные с проведением Конкурса.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">6. Порядок и условия обработки персональных данных</h2>
              <p className="text-muted-foreground">
                6.1. Обработка персональных данных осуществляется с согласия субъекта персональных данных на обработку его персональных данных.
              </p>
              <p className="text-muted-foreground mt-2">
                6.2. Оператор осуществляет как автоматизированную, так и неавтоматизированную обработку персональных данных.
              </p>
              <p className="text-muted-foreground mt-2">
                6.3. К обработке персональных данных допускаются только те сотрудники Оператора, в должностные обязанности которых входит обработка персональных данных.
              </p>
              <p className="text-muted-foreground mt-2">
                6.4. Оператор вправе передавать персональные данные третьим лицам в следующих случаях:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Субъект персональных данных выразил согласие на передачу своих данных;</li>
                <li>Передача предусмотрена российским законодательством в рамках установленной процедуры.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                6.5. Срок обработки персональных данных определяется достижением целей, для которых были собраны персональные данные, если иной срок не предусмотрен договором или действующим законодательством.
              </p>
              <p className="text-muted-foreground mt-2">
                6.6. Оператор прекращает обработку персональных данных в следующих случаях:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>По истечении срока обработки персональных данных;</li>
                <li>По достижении целей их обработки либо в случае утраты необходимости в достижении этих целей;</li>
                <li>По требованию субъекта персональных данных, если обрабатываемые персональные данные являются незаконно полученными или не являются необходимыми для заявленной цели обработки;</li>
                <li>В случае выявления неправомерной обработки персональных данных, если обеспечить правомерность обработки невозможно;</li>
                <li>В случае отзыва субъектом персональных данных согласия на обработку его персональных данных.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">7. Права субъектов персональных данных</h2>
              <p className="text-muted-foreground">
                7.1. Субъект персональных данных имеет право:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                <li>Получать информацию, касающуюся обработки его персональных данных;</li>
                <li>Требовать от Оператора уточнения его персональных данных, их блокирования или уничтожения в случае, если персональные данные являются неполными, устаревшими, неточными, незаконно полученными или не являются необходимыми для заявленной цели обработки;</li>
                <li>Отозвать свое согласие на обработку персональных данных;</li>
                <li>Требовать устранения неправомерных действий Оператора в отношении его персональных данных;</li>
                <li>Обжаловать действия или бездействие Оператора в уполномоченный орган по защите прав субъектов персональных данных или в судебном порядке.</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">8. Ответственность</h2>
              <p className="text-muted-foreground">
                8.1. Оператор несет ответственность за нарушение требований законодательства Российской Федерации о персональных данных в соответствии с законодательством Российской Федерации.
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">9. Контактная информация</h2>
              <p className="text-muted-foreground">
                9.1. По всем вопросам, связанным с обработкой персональных данных, можно обращаться по адресу: г. Кемерово, пр. Советский, 54, по телефону: +7 (3842) 45-XX-XX, или по электронной почте: dvorkemerovo@example.com.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
