import { useState } from 'react';
import { toast } from 'sonner';
import { Language } from '@/lib/translations';
import { User } from '@/lib/types';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AIChat from '@/components/AIChat';
import PricingSection from '@/components/PricingSection';
import FounderSection from '@/components/FounderSection';
import ProfileSection from '@/components/ProfileSection';

export default function Index() {
  const [lang, setLang] = useState<Language>('ru');
  const [country, setCountry] = useState('ru');
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === 'ceo_egor_selitsky_2025' && password === 'NP2025_Secure!Admin#CEO$789') {
      setUser({
        id: 1,
        username: 'ceo_egor_selitsky_2025',
        role: 'admin',
        daily_requests_remaining: 999999,
        bonus_requests: 999999,
        subscription_type: 'unlimited',
      });
      setLoginOpen(false);
      toast.success(lang === 'ru' ? 'Вход выполнен!' : 'Logged in successfully!');
    } else {
      toast.error(lang === 'ru' ? 'Неверные данные' : 'Invalid credentials');
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;

    setUser({
      id: 2,
      username,
      role: 'user',
      daily_requests_remaining: 10,
      bonus_requests: 5,
      subscription_type: null,
    });
    setRegisterOpen(false);
    toast.success(lang === 'ru' ? 'Регистрация успешна! +5 бонусных запросов' : 'Registration successful! +5 bonus requests');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navigation
        lang={lang}
        setLang={setLang}
        country={country}
        setCountry={setCountry}
        user={user}
        setUser={setUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loginOpen={loginOpen}
        setLoginOpen={setLoginOpen}
        registerOpen={registerOpen}
        setRegisterOpen={setRegisterOpen}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />

      <main className="container mx-auto px-4 py-12">
        {activeTab === 'home' && (
          <div className="space-y-16">
            <HeroSection lang={lang} user={user} setRegisterOpen={setRegisterOpen} />
            <AIChat lang={lang} user={user} setUser={setUser as (user: User) => void} />
          </div>
        )}

        {activeTab === 'pricing' && (
          <PricingSection lang={lang} country={country} user={user} />
        )}

        {activeTab === 'founder' && (
          <FounderSection lang={lang} />
        )}

        {activeTab === 'profile' && user && (
          <ProfileSection lang={lang} country={country} user={user} setActiveTab={setActiveTab} />
        )}
      </main>

      <footer className="border-t mt-20 py-8 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 NeuroPulse. {lang === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}</p>
        </div>
      </footer>
    </div>
  );
}