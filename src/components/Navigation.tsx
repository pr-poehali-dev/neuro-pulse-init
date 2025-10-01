import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Language, translations } from '@/lib/translations';
import { User } from '@/lib/types';

interface NavigationProps {
  lang: Language;
  setLang: (lang: Language) => void;
  country: string;
  setCountry: (country: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
  registerOpen: boolean;
  setRegisterOpen: (open: boolean) => void;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  handleRegister: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Navigation({
  lang,
  setLang,
  country,
  setCountry,
  user,
  setUser,
  activeTab,
  setActiveTab,
  loginOpen,
  setLoginOpen,
  registerOpen,
  setRegisterOpen,
  handleLogin,
  handleRegister,
}: NavigationProps) {
  const t = translations[lang];

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Icon name="Sparkles" className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            NeuroPulse
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Button variant="ghost" onClick={() => setActiveTab('home')}>{t.nav.home}</Button>
          <Button variant="ghost" onClick={() => setActiveTab('pricing')}>{t.nav.pricing}</Button>
          <Button variant="ghost" onClick={() => setActiveTab('founder')}>{t.nav.founder}</Button>

          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ru">🇷🇺 Россия</SelectItem>
              <SelectItem value="us">🇺🇸 USA</SelectItem>
              <SelectItem value="eu">🇪🇺 Europe</SelectItem>
              <SelectItem value="uk">🇬🇧 UK</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={lang} onValueChange={(val) => setLang(val as Language)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ru">🇷🇺 RU</SelectItem>
              <SelectItem value="en">🇬🇧 EN</SelectItem>
            </SelectContent>
          </Select>

          {user ? (
            <>
              <Button variant="outline" onClick={() => setActiveTab('profile')}>
                <Icon name="User" size={18} className="mr-2" />
                {user.username}
              </Button>
              <Button variant="ghost" onClick={() => setUser(null)}>
                {t.auth.logout}
              </Button>
            </>
          ) : (
            <>
              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">{t.auth.login}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.auth.login}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label>{t.auth.username}</Label>
                      <Input name="username" required />
                    </div>
                    <div>
                      <Label>{t.auth.password}</Label>
                      <Input name="password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">{t.auth.loginButton}</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                <DialogTrigger asChild>
                  <Button>{t.auth.register}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.auth.register}</DialogTitle>
                    <DialogDescription>{t.pricing.bonus}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label>{t.auth.username}</Label>
                      <Input name="username" required />
                    </div>
                    <div>
                      <Label>{t.auth.password}</Label>
                      <Input name="password" type="password" required />
                    </div>
                    <div>
                      <Label>{t.auth.email}</Label>
                      <Input name="email" type="email" />
                    </div>
                    <Button type="submit" className="w-full">{t.auth.registerButton}</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
