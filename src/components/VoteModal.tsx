import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import UserAgreementDialog from './UserAgreementDialog';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: number;
    title: string;
  };
}

interface FormattedPhone {
  formatted: string;
  isValid: boolean;
}

const VoteModal = ({ isOpen, onClose, project }: VoteModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  const handleSendVerificationCode = async () => {
    if (!phone || !email) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите номер телефона и email",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Ошибка",
        description: "Некорректный email",
        variant: "destructive"
      });
      return;
    }

    if (!isPhoneValid) {
      toast({
        title: "Ошибка",
        description: "Некорректный номер телефона",
        variant: "destructive"
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Ошибка",
        description: "Необходимо согласиться с пользовательским соглашением",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("https://best-yard.onrender.com/api/email/send-code2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          userId: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось отправить код",
          variant: "destructive",
        });
      } else {
        setStep(2);
        toast({
          title: "Код отправлен",
          description: "Проверьте вашу электронную почту",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при отправке кода",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите код подтверждения",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("https://best-yard.onrender.com/api/email/verify-and-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: email,
          code: verificationCode,
          projectId: project.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось подтвердить код",
          variant: "destructive",
        });
      } else {
        setStep(3);
        toast({
          title: "Успешно!",
          description: "Ваш голос учтен",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при проверке кода",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string): FormattedPhone => {
  // Оставляем только цифры
  let digits = value.replace(/\D/g, '');

  // Удаляем первую цифру (если она 8 или 7), и насильно ставим 7
  if (digits.startsWith('8') || digits.startsWith('7')) {
    digits = digits.slice(1);
  }

  // Принудительно добавляем "7" в начало, чтобы номер был российским
  digits = '7' + digits.slice(0, 10); // максимум 10 цифр после "7"

  // Форматируем
  const num = digits;

  let formatted = '+7';
  if (num.length > 1) formatted += ` (${num.slice(1, 4)}`;
  if (num.length >= 4) formatted += `) ${num.slice(4, 7)}`;
  if (num.length >= 7) formatted += `-${num.slice(7, 9)}`;
  if (num.length >= 9) formatted += `-${num.slice(9, 11)}`;

  return {
    formatted,
    isValid: num.length === 11,
  };
};

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const onlyDigits = e.target.value.replace(/\D/g, '');
  const { formatted, isValid } = formatPhoneNumber(onlyDigits);
  setPhone(formatted);
  setIsPhoneValid(isValid);
};

  const handleDialogClose = () => {
    setTimeout(() => {
      setStep(1);
      setPhone('');
      setEmail('');
      setVerificationCode('');
      setAgreedToTerms(false);
    }, 300);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Голосование за проект"}
            {step === 2 && "Подтверждение email"}
            {step === 3 && "Голос учтен"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && `Вы голосуете за проект "${project.title}"`}
            {step === 2 && "Введите код, отправленный на вашу почту"}
            {step === 3 && "Спасибо за участие в голосовании!"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={handlePhoneChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex items-top space-x-2 mt-4">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Я согласен с{" "}
                  <UserAgreementDialog>
                    <button className="text-primary hover:underline font-medium" type="button">
                      пользовательским соглашением
                    </button>
                  </UserAgreementDialog>
                  {" "}на обработку моих персональных данных
                </Label>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleSendVerificationCode}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Отправка..." : "Отправить код"}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center mb-4 text-primary">
              <Mail className="h-12 w-12" />
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                Мы отправили код подтверждения на адрес<br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-code">Код подтверждения</Label>
              <Input
                id="verification-code"
                placeholder="Введите 6-значный код"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleVerifyCode}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Проверка..." : "Подтвердить"}
            </Button>

            <div className="text-center">
              <button
                className="text-sm text-primary hover:underline"
                onClick={handleSendVerificationCode}
                disabled={isSubmitting}
              >
                Отправить код повторно
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Ваш голос учтен!</p>
              <p className="text-sm text-muted-foreground">
                Спасибо за участие в голосовании за проект "{project.title}"
              </p>
            </div>

            <Button
              className="w-full"
              onClick={handleDialogClose}
            >
              Закрыть
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VoteModal;
