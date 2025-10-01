import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Language, translations } from '@/lib/translations';
import { User } from '@/lib/types';
import ManualPayment from './ManualPayment';

interface PricingSectionProps {
  lang: Language;
  country: string;
  user: User | null;
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

export default function PricingSection({ lang, country, user }: PricingSectionProps) {
  const t = translations[lang];
  const prices = countryPrices[country as keyof typeof countryPrices];
  const [manualPaymentOpen, setManualPaymentOpen] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState<{ type: string; amount: number } | null>(null);

  const handlePurchase = (tariffType: string, amount: number) => {
    if (!user) {
      toast.error(lang === 'ru' ? 'Войдите в систему' : 'Please log in');
      return;
    }

    setSelectedTariff({ type: tariffType, amount });
    setManualPaymentOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">{t.pricing.title}</h2>
        <p className="text-xl text-muted-foreground">{t.pricing.subtitle}</p>
        <Badge variant="outline" className="text-sm">{t.pricing.bonus}</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card className="hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle>{t.pricing.starter.name}</CardTitle>
            <CardDescription>{t.pricing.starter.desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">
              {prices.starter.price} {prices.currency}
            </div>
            <div className="text-muted-foreground">{prices.starter.requests} {lang === 'ru' ? 'запросов' : 'requests'}</div>
            <Button 
              className="w-full" 
              disabled={!user}
              onClick={() => handlePurchase('starter', prices.starter.price)}
            >
              {t.pricing.button}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all border-primary">
          <CardHeader>
            <Badge className="w-fit mb-2">{lang === 'ru' ? 'Популярный' : 'Popular'}</Badge>
            <CardTitle>{t.pricing.advanced.name}</CardTitle>
            <CardDescription>{t.pricing.advanced.desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">
              {prices.advanced.price} {prices.currency}
            </div>
            <div className="text-muted-foreground">{prices.advanced.requests} {lang === 'ru' ? 'запросов' : 'requests'}</div>
            <Button 
              className="w-full" 
              disabled={!user}
              onClick={() => handlePurchase('advanced', prices.advanced.price)}
            >
              {t.pricing.button}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all">
          <CardHeader>
            <CardTitle>{t.pricing.unlimited.name}</CardTitle>
            <CardDescription>{t.pricing.unlimited.desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">
              {prices.unlimited.price} {prices.currency}
            </div>
            <div className="text-muted-foreground">{lang === 'ru' ? 'Безлимит' : 'Unlimited'}</div>
            <Button 
              className="w-full" 
              disabled={!user}
              onClick={() => handlePurchase('unlimited', prices.unlimited.price)}
            >
              {t.pricing.button}
            </Button>
          </CardContent>
        </Card>
      </div>

      {selectedTariff && user && (
        <ManualPayment
          lang={lang}
          open={manualPaymentOpen}
          onOpenChange={setManualPaymentOpen}
          tariffType={selectedTariff.type}
          amount={selectedTariff.amount}
          currency={prices.currency}
          userId={user.id}
        />
      )}
    </div>
  );
}