import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Language } from '@/lib/translations';

interface PaymentSuccessProps {
  lang: Language;
  onClose: () => void;
}

export default function PaymentSuccess({ lang, onClose }: PaymentSuccessProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl animate-in zoom-in-95">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="CheckCircle" size={32} className="text-green-600" />
          </div>
          <CardTitle className="text-2xl">
            {lang === 'ru' ? 'Оплата успешна!' : 'Payment Successful!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {lang === 'ru' 
              ? 'Запросы начислены на ваш аккаунт. Можете продолжать работу!'
              : 'Requests have been added to your account. You can continue working!'}
          </p>
          <Button className="w-full" size="lg" onClick={onClose}>
            <Icon name="ArrowRight" size={18} className="mr-2" />
            {lang === 'ru' ? 'Продолжить' : 'Continue'}
          </Button>
          <p className="text-xs text-muted-foreground">
            {lang === 'ru' ? 'Окно закроется автоматически через 5 секунд' : 'Window will close automatically in 5 seconds'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
