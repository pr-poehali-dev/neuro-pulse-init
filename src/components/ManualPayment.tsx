import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Language } from '@/lib/translations';

interface ManualPaymentProps {
  lang: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tariffType: string;
  amount: number;
  currency: string;
  userId: number;
}

const CARD_NUMBER = '2202 2082 6857 2758';
const CARD_HOLDER = 'Егор Селицкий';

export default function ManualPayment({ 
  lang, 
  open, 
  onOpenChange, 
  tariffType, 
  amount, 
  currency,
  userId 
}: ManualPaymentProps) {
  const [paymentProof, setPaymentProof] = useState('');
  const [senderName, setSenderName] = useState('');

  const handleCopyCard = () => {
    navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ''));
    toast.success(lang === 'ru' ? 'Номер карты скопирован!' : 'Card number copied!');
  };

  const handleSubmit = async () => {
    if (!senderName.trim()) {
      toast.error(lang === 'ru' ? 'Укажите ваше имя' : 'Enter your name');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/819a4047-748d-425e-bf3a-492bc1ccc50f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tariffType,
          amount,
          currency,
          senderName,
          paymentProof,
          status: 'pending'
        })
      });

      if (response.ok) {
        toast.success(
          lang === 'ru' 
            ? 'Заявка отправлена! Ожидайте подтверждения в течение 1-24 часов.' 
            : 'Request submitted! Wait for confirmation within 1-24 hours.'
        );
        onOpenChange(false);
        setPaymentProof('');
        setSenderName('');
      } else {
        toast.error(lang === 'ru' ? 'Ошибка отправки' : 'Submission error');
      }
    } catch (error) {
      toast.error(lang === 'ru' ? 'Ошибка сервера' : 'Server error');
    }
  };

  const tariffNames: Record<string, { ru: string; en: string }> = {
    starter: { ru: 'Стартовый', en: 'Starter' },
    advanced: { ru: 'Продвинутый', en: 'Advanced' },
    unlimited: { ru: 'Безлимит', en: 'Unlimited' }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="CreditCard" size={24} />
            {lang === 'ru' ? 'Оплата тарифа' : 'Tariff Payment'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-80">
                    {lang === 'ru' ? 'Тариф' : 'Plan'}
                  </p>
                  <p className="text-2xl font-bold">
                    {lang === 'ru' ? tariffNames[tariffType]?.ru : tariffNames[tariffType]?.en}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-80">
                    {lang === 'ru' ? 'Сумма к оплате' : 'Amount to pay'}
                  </p>
                  <p className="text-3xl font-bold">{amount} {currency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Info" size={20} />
              {lang === 'ru' ? 'Инструкция по оплате' : 'Payment Instructions'}
            </h3>
            
            <ol className="space-y-3 text-sm list-decimal list-inside">
              <li>
                {lang === 'ru' 
                  ? 'Откройте приложение Сбербанк или любой другой банк' 
                  : 'Open Sberbank app or any other bank app'}
              </li>
              <li>
                {lang === 'ru' 
                  ? 'Выберите "Перевод по номеру карты"' 
                  : 'Select "Transfer by card number"'}
              </li>
              <li>
                {lang === 'ru' 
                  ? 'Скопируйте номер карты ниже и вставьте в приложение' 
                  : 'Copy card number below and paste in the app'}
              </li>
              <li>
                {lang === 'ru' 
                  ? `Переведите точную сумму: ${amount} ${currency}` 
                  : `Transfer exact amount: ${amount} ${currency}`}
              </li>
              <li>
                {lang === 'ru' 
                  ? 'После перевода заполните форму ниже и нажмите "Отправить заявку"' 
                  : 'After transfer, fill the form below and click "Submit Request"'}
              </li>
            </ol>
          </div>

          <Card className="border-2 border-primary">
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'ru' ? 'Номер карты получателя' : 'Recipient card number'}
                  </p>
                  <p className="text-2xl font-mono font-bold tracking-wider">{CARD_NUMBER}</p>
                  <p className="text-sm text-muted-foreground mt-1">{CARD_HOLDER}</p>
                </div>
                <Button onClick={handleCopyCard} size="lg">
                  <Icon name="Copy" size={18} className="mr-2" />
                  {lang === 'ru' ? 'Скопировать' : 'Copy'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">
              {lang === 'ru' ? 'Подтверждение платежа' : 'Payment Confirmation'}
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="senderName">
                {lang === 'ru' ? 'Ваше имя (как в банке) *' : 'Your name (as in bank) *'}
              </Label>
              <Input
                id="senderName"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder={lang === 'ru' ? 'Иван Иванов' : 'John Doe'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentProof">
                {lang === 'ru' ? 'Последние 4 цифры карты отправителя (опционально)' : 'Last 4 digits of sender card (optional)'}
              </Label>
              <Input
                id="paymentProof"
                value={paymentProof}
                onChange={(e) => setPaymentProof(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="1234"
                maxLength={4}
              />
              <p className="text-xs text-muted-foreground">
                {lang === 'ru' 
                  ? 'Это поможет нам быстрее найти ваш платёж' 
                  : 'This will help us find your payment faster'}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <Icon name="Clock" size={20} className="text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>{lang === 'ru' ? 'Время обработки:' : 'Processing time:'}</strong>{' '}
              {lang === 'ru' 
                ? 'Платежи проверяются вручную в течение 1-24 часов. После подтверждения запросы будут начислены автоматически.' 
                : 'Payments are verified manually within 1-24 hours. Requests will be added automatically after confirmation.'}
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1" size="lg" onClick={handleSubmit}>
              <Icon name="Send" size={18} className="mr-2" />
              {lang === 'ru' ? 'Отправить заявку' : 'Submit Request'}
            </Button>
            <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              {lang === 'ru' ? 'Отмена' : 'Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}