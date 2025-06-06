
import { ScrollArea } from "@/components/ui/scroll-area";

const UserAgreement = () => {
  return (
    <ScrollArea className="h-[70vh] w-full rounded-md border p-4">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Пользовательское соглашение</h1>
        
        <h2 className="text-xl font-semibold">1. Общие положения</h2>
        <p>
          1.1. Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между пользователем сети Интернет (далее — «Пользователь») и владельцем настоящего сайта (далее — «Администрация»).
        </p>
        <p>
          1.2. Используя сайт и его функционал, Пользователь выражает свое полное и безоговорочное согласие с условиями настоящего Соглашения.
        </p>
        
        <h2 className="text-xl font-semibold">2. Предмет соглашения</h2>
        <p>
          2.1. Предметом настоящего Соглашения является предоставление Пользователю доступа к функционалу голосования за проекты на сайте.
        </p>
        <p>
          2.2. Для участия в голосовании Пользователь предоставляет свои персональные данные, включая номер телефона и адрес электронной почты (e-mail).
        </p>
        
        <h2 className="text-xl font-semibold">3. Согласие на обработку персональных данных</h2>
        <p>
          3.1. Пользователь дает своё согласие на обработку предоставленных персональных данных, включая сбор, запись, систематизацию, накопление, хранение, уточнение, извлечение, использование, передачу, обезличивание, блокирование, удаление, уничтожение персональных данных.
        </p>
        <p>
          3.2. Целями обработки персональных данных являются:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Учет голосов пользователей за проекты</li>
          <li>Предотвращение мошенничества и множественных голосований</li>
          <li>Информирование о статусе проекта, за который проголосовал Пользователь</li>
          <li>Улучшение функционала сервиса</li>
        </ul>
        
        <h2 className="text-xl font-semibold">4. Условия обработки персональных данных</h2>
        <p>
          4.1. Администрация обязуется не передавать персональные данные Пользователя третьим лицам без согласия Пользователя, за исключением случаев, предусмотренных законодательством РФ.
        </p>
        <p>
          4.2. Администрация принимает необходимые и достаточные меры для защиты персональных данных Пользователя от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения, а также от иных неправомерных действий третьих лиц.
        </p>
        <p>
          4.3. Срок хранения персональных данных Пользователя составляет 3 (три) года с момента последней активности Пользователя на сайте.
        </p>
        
        <h2 className="text-xl font-semibold">5. Права и обязанности Пользователя</h2>
        <p>
          5.1. Пользователь имеет право:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Получать информацию, касающуюся обработки его персональных данных</li>
          <li>Требовать удаления, блокирования или уточнения своих персональных данных</li>
          <li>Отозвать согласие на обработку персональных данных</li>
        </ul>
        <p>
          5.2. Пользователь обязуется:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Предоставлять достоверную информацию о себе</li>
          <li>Не использовать чужие персональные данные</li>
          <li>Не совершать действий, направленных на обход системы защиты от множественного голосования</li>
        </ul>
        
        <h2 className="text-xl font-semibold">6. Заключительные положения</h2>
        <p>
          6.1. Настоящее Соглашение вступает в силу с момента выражения Пользователем согласия с его условиями путем проставления отметки в чекбоксе "Я согласен с условиями пользовательского соглашения".
        </p>
        <p>
          6.2. Администрация оставляет за собой право вносить изменения в настоящее Соглашение с уведомлением Пользователей путем размещения новой редакции Соглашения на сайте.
        </p>
        <p>
          6.3. Все вопросы, не урегулированные настоящим Соглашением, подлежат разрешению в соответствии с законодательством Российской Федерации.
        </p>
        
        <div className="text-center mt-8 text-sm text-gray-500">
          Последнее обновление: 17 мая 2025 г.
        </div>
      </div>
    </ScrollArea>
  );
};

export default UserAgreement;
