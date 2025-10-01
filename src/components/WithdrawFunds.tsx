import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Language } from '@/lib/translations';
import { toast } from 'sonner';

interface WithdrawFundsProps {
  lang: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WithdrawFunds({ lang, open, onOpenChange }: WithdrawFundsProps) {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const availableBalance = 0;

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(lang === 'ru' ? 'Введите сумму вывода' : 'Enter withdrawal amount');
      return;
    }

    if (parseFloat(amount) > availableBalance) {
      toast.error(lang === 'ru' ? 'Недостаточно средств' : 'Insufficient funds');
      return;
    }

    if (paymentMethod === 'card' && !cardNumber) {
      toast.error(lang === 'ru' ? 'Введите номер карты' : 'Enter card number');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      toast.success(
        lang === 'ru' 
          ? `Заявка на вывод ${amount} ₽ принята. Средства поступят в течение 1-3 рабочих дней.`
          : `Withdrawal request for ${amount} ₽ accepted. Funds will arrive within 1-3 business days.`
      );
      setAmount('');
      setCardNumber('');
      setLoading(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Wallet" size={24} />
            {lang === 'ru' ? 'Вывод средств' : 'Withdraw Funds'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardHeader>
              <CardTitle className="text-white">
                {lang === 'ru' ? 'Доступно к выводу' : 'Available Balance'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {availableBalance.toLocaleString()} ₽
              </div>
              <p className="text-sm text-white/80 mt-2">
                {lang === 'ru' ? 'Доход от продажи тарифов' : 'Revenue from tariff sales'}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <Label>{lang === 'ru' ? 'Способ вывода' : 'Withdrawal Method'}</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">
                    {lang === 'ru' ? 'Банковская карта' : 'Bank Card'}
                  </SelectItem>
                  <SelectItem value="sbp">
                    {lang === 'ru' ? 'СБП (Система быстрых платежей)' : 'SBP (Fast Payment System)'}
                  </SelectItem>
                  <SelectItem value="yoomoney">
                    {lang === 'ru' ? 'ЮMoney' : 'YooMoney'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{lang === 'ru' ? 'Сумма вывода (₽)' : 'Withdrawal Amount (₽)'}</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10000"
                className="mt-2"
                min="100"
                max={availableBalance}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {lang === 'ru' ? 'Минимальная сумма: 100 ₽' : 'Minimum amount: 100 ₽'}
              </p>
            </div>

            {paymentMethod === 'card' && (
              <div>
                <Label>{lang === 'ru' ? 'Номер банковской карты' : 'Bank Card Number'}</Label>
                <Input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="mt-2"
                  maxLength={19}
                />
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {lang === 'ru' ? 'Условия вывода' : 'Withdrawal Terms'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• {lang === 'ru' ? 'Комиссия: 0% (оплачивается платформой)' : 'Fee: 0% (paid by platform)'}</p>
                <p>• {lang === 'ru' ? 'Время обработки: 1-3 рабочих дня' : 'Processing time: 1-3 business days'}</p>
                <p>• {lang === 'ru' ? 'Статус заявки можно отследить в истории операций' : 'Request status can be tracked in transaction history'}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleWithdraw} 
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  {lang === 'ru' ? 'Обработка...' : 'Processing...'}
                </>
              ) : (
                <>
                  <Icon name="ArrowDownToLine" size={18} className="mr-2" />
                  {lang === 'ru' ? 'Вывести средства' : 'Withdraw Funds'}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              {lang === 'ru' ? 'Отмена' : 'Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}