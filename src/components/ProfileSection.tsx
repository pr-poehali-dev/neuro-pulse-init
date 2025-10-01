import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Language, translations } from '@/lib/translations';
import { User } from '@/lib/types';
import AdminStats from './AdminStats';
import UIEditor from './UIEditor';
import WithdrawFunds from './WithdrawFunds';
import { toast } from 'sonner';

interface ProfileSectionProps {
  lang: Language;
  country: string;
  user: User;
  setActiveTab: (tab: string) => void;
}

const countryPrices = {
  ru: {
    currency: '₽',
    starter: { price: 199, requests: 20 },
    advanced: { price: 299, requests: 40 },
    unlimited: { price: 749, duration: 30 },
  },
  us: {
    currency: '$',
    starter: { price: 2.99, requests: 20 },
    advanced: { price: 4.49, requests: 40 },
    unlimited: { price: 11.99, duration: 30 },
  },
  eu: {
    currency: '€',
    starter: { price: 2.49, requests: 20 },
    advanced: { price: 3.99, requests: 40 },
    unlimited: { price: 9.99, duration: 30 },
  },
  uk: {
    currency: '£',
    starter: { price: 2.19, requests: 20 },
    advanced: { price: 3.49, requests: 40 },
    unlimited: { price: 8.99, duration: 30 },
  },
};

export default function ProfileSection({ lang, country, user, setActiveTab }: ProfileSectionProps) {
  const t = translations[lang];
  const [statsOpen, setStatsOpen] = useState(false);
  const [uiEditorOpen, setUIEditorOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const prices = countryPrices[country as keyof typeof countryPrices];

  const handlePurchase = async (tariffType: string, amount: number) => {
    toast.loading(lang === 'ru' ? 'Перенаправление на оплату...' : 'Redirecting to payment...');

    try {
      const response = await fetch('https://functions.poehali.dev/fff27173-4bd6-4f1f-9c6f-c81df295fe5f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id,
          tariffType,
          amount,
          currency: prices.currency,
          country 
        }),
      });

      const data = await response.json();
      
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.error || (lang === 'ru' ? 'Ошибка создания платежа' : 'Payment creation error'));
      }
    } catch (error) {
      toast.error(lang === 'ru' ? 'Ошибка сервера' : 'Server error');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="User" size={24} />
            {t.profile.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t.profile.daily}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{user.daily_requests_remaining}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t.profile.bonus}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{user.bonus_requests}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t.profile.subscription}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge>{user.subscription_type || 'Free'}</Badge>
              </CardContent>
            </Card>
          </div>

          {user.role !== 'admin' && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Icon name="CreditCard" size={20} />
                {lang === 'ru' ? 'Купить тариф' : 'Buy Plan'}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="text-sm">{lang === 'ru' ? 'Стартовый' : 'Starter'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-2xl font-bold">
                      {prices.starter.price} {prices.currency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prices.starter.requests} {lang === 'ru' ? 'запросов' : 'requests'}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handlePurchase('starter', prices.starter.price)}
                    >
                      <Icon name="ShoppingCart" size={16} className="mr-2" />
                      {lang === 'ru' ? 'Купить' : 'Buy'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all border-primary">
                  <CardHeader>
                    <Badge className="w-fit mb-1">{lang === 'ru' ? 'Популярный' : 'Popular'}</Badge>
                    <CardTitle className="text-sm">{lang === 'ru' ? 'Продвинутый' : 'Advanced'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-2xl font-bold">
                      {prices.advanced.price} {prices.currency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prices.advanced.requests} {lang === 'ru' ? 'запросов' : 'requests'}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handlePurchase('advanced', prices.advanced.price)}
                    >
                      <Icon name="ShoppingCart" size={16} className="mr-2" />
                      {lang === 'ru' ? 'Купить' : 'Buy'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="text-sm">{lang === 'ru' ? 'Безлимит' : 'Unlimited'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-2xl font-bold">
                      {prices.unlimited.price} {prices.currency}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {lang === 'ru' ? 'Безлимит на месяц' : 'Unlimited/month'}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handlePurchase('unlimited', prices.unlimited.price)}
                    >
                      <Icon name="ShoppingCart" size={16} className="mr-2" />
                      {lang === 'ru' ? 'Купить' : 'Buy'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveTab('pricing')}
              >
                <Icon name="Eye" size={18} className="mr-2" />
                {lang === 'ru' ? 'Посмотреть все тарифы' : 'View All Plans'}
              </Button>
            </div>
          )}

          {user.role === 'admin' && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Icon name="Shield" size={20} />
                {t.profile.admin}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" onClick={() => setStatsOpen(true)}>
                  <Icon name="Users" size={18} className="mr-2" />
                  {t.profile.stats}
                </Button>
                <Button variant="outline" onClick={() => setUIEditorOpen(true)}>
                  <Icon name="Settings" size={18} className="mr-2" />
                  {t.profile.editUI}
                </Button>
                <Button variant="outline" onClick={() => setWithdrawOpen(true)}>
                  <Icon name="Wallet" size={18} className="mr-2" />
                  {t.profile.withdraw}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AdminStats lang={lang} open={statsOpen} onOpenChange={setStatsOpen} />
      <UIEditor lang={lang} open={uiEditorOpen} onOpenChange={setUIEditorOpen} />
      <WithdrawFunds lang={lang} open={withdrawOpen} onOpenChange={setWithdrawOpen} />
    </div>
  );
}
