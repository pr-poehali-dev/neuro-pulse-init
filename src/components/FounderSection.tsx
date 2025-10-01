import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Language, translations } from '@/lib/translations';

interface FounderSectionProps {
  lang: Language;
}

export default function FounderSection({ lang }: FounderSectionProps) {
  const t = translations[lang];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
            <Icon name="User" size={48} className="text-white" />
          </div>
          <CardTitle className="text-3xl">{t.founder.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <h3 className="text-2xl font-semibold">{t.founder.name}</h3>
          <p className="text-muted-foreground">{t.founder.role}</p>
          <Badge variant="outline">{t.founder.year}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
