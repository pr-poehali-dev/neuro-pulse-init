import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Language, translations } from '@/lib/translations';
import { User } from '@/lib/types';

interface ProfileSectionProps {
  lang: Language;
  user: User;
}

export default function ProfileSection({ lang, user }: ProfileSectionProps) {
  const t = translations[lang];

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

          {user.role === 'admin' && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Icon name="Shield" size={20} />
                {t.profile.admin}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline">
                  <Icon name="Users" size={18} className="mr-2" />
                  {t.profile.stats}
                </Button>
                <Button variant="outline">
                  <Icon name="Settings" size={18} className="mr-2" />
                  {t.profile.editUI}
                </Button>
                <Button variant="outline">
                  <Icon name="Wallet" size={18} className="mr-2" />
                  {t.profile.withdraw}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
