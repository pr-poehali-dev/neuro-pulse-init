import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Language, translations } from '@/lib/translations';
import { User } from '@/lib/types';

interface HeroSectionProps {
  lang: Language;
  user: User | null;
  setRegisterOpen: (open: boolean) => void;
}

export default function HeroSection({ lang, user, setRegisterOpen }: HeroSectionProps) {
  const t = translations[lang];

  return (
    <div className="text-center space-y-6 py-12">
      <Badge className="mb-4" variant="outline">
        <Icon name="Zap" size={14} className="mr-1" />
        {lang === 'ru' ? '10 бесплатных запросов каждый день' : '10 free requests daily'}
      </Badge>
      <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
        {t.hero.title}
      </h1>
      <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
        {t.hero.subtitle}
      </p>
      <p className="text-lg text-muted-foreground max-w-xl mx-auto">
        {t.hero.description}
      </p>
      <div className="flex gap-4 justify-center pt-4">
        {!user && (
          <Button size="lg" onClick={() => setRegisterOpen(true)}>
            {t.hero.cta}
            <Icon name="ArrowRight" size={18} className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
