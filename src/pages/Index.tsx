import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Language = 'ru' | 'en';

interface User {
  id: number;
  username: string;
  role: string;
  daily_requests_remaining: number;
  bonus_requests: number;
  subscription_type: string | null;
}

const translations = {
  ru: {
    hero: {
      title: 'NeuroPulse',
      subtitle: 'Ваш умный AI-помощник для учёбы и работы',
      description: 'Помогаем студентам и школьникам учиться эффективнее с помощью искусственного интеллекта',
      cta: 'Начать бесплатно',
      login: 'Войти',
    },
    nav: {
      home: 'Главная',
      pricing: 'Тарифы',
      founder: 'Основатель',
      profile: 'Профиль',
    },
    pricing: {
      title: 'Выберите свой тариф',
      subtitle: 'Первые 10 запросов каждый день — бесплатно!',
      starter: {
        name: 'Стартовый',
        price: '199 ₽',
        requests: '20 запросов',
        desc: 'Разовый платеж',
      },
      advanced: {
        name: 'Продвинутый',
        price: '299 ₽',
        requests: '40 запросов',
        desc: 'Разовый платеж',
      },
      unlimited: {
        name: 'Безлимит',
        price: '749 ₽',
        requests: 'Безлимит',
        desc: 'На 1 месяц',
      },
      button: 'Выбрать',
      bonus: '+5 запросов за регистрацию',
    },
    founder: {
      title: 'Основатель',
      name: 'Егор Селицкий',
      role: 'CEO & Основатель проекта',
      year: 'Год основания: 2025',
    },
    auth: {
      login: 'Вход',
      register: 'Регистрация',
      username: 'Логин',
      password: 'Пароль',
      email: 'Email (опционально)',
      loginButton: 'Войти',
      registerButton: 'Зарегистрироваться',
      logout: 'Выйти',
    },
    profile: {
      title: 'Личный кабинет',
      requests: 'Доступно запросов',
      daily: 'Ежедневные',
      bonus: 'Бонусные',
      subscription: 'Подписка',
      admin: 'Админ-панель',
      stats: 'Статистика пользователей',
      editUI: 'Редактировать интерфейс',
      withdraw: 'Вывести средства',
    },
    chat: {
      placeholder: 'Задайте вопрос AI...',
      send: 'Отправить',
      remaining: 'Осталось запросов',
      upgrade: 'Пополнить',
    },
  },
  en: {
    hero: {
      title: 'NeuroPulse',
      subtitle: 'Your Smart AI Assistant for Study & Work',
      description: 'Helping students and learners study more effectively with artificial intelligence',
      cta: 'Start Free',
      login: 'Log In',
    },
    nav: {
      home: 'Home',
      pricing: 'Pricing',
      founder: 'Founder',
      profile: 'Profile',
    },
    pricing: {
      title: 'Choose Your Plan',
      subtitle: 'First 10 requests daily — free!',
      starter: {
        name: 'Starter',
        price: '$2.99',
        requests: '20 requests',
        desc: 'One-time payment',
      },
      advanced: {
        name: 'Advanced',
        price: '$4.49',
        requests: '40 requests',
        desc: 'One-time payment',
      },
      unlimited: {
        name: 'Unlimited',
        price: '$11.99',
        requests: 'Unlimited',
        desc: 'Per month',
      },
      button: 'Choose',
      bonus: '+5 requests for registration',
    },
    founder: {
      title: 'Founder',
      name: 'Egor Selitsky',
      role: 'CEO & Project Founder',
      year: 'Founded: 2025',
    },
    auth: {
      login: 'Log In',
      register: 'Sign Up',
      username: 'Username',
      password: 'Password',
      email: 'Email (optional)',
      loginButton: 'Log In',
      registerButton: 'Sign Up',
      logout: 'Log Out',
    },
    profile: {
      title: 'Dashboard',
      requests: 'Available Requests',
      daily: 'Daily',
      bonus: 'Bonus',
      subscription: 'Subscription',
      admin: 'Admin Panel',
      stats: 'User Statistics',
      editUI: 'Edit Interface',
      withdraw: 'Withdraw Funds',
    },
    chat: {
      placeholder: 'Ask AI anything...',
      send: 'Send',
      remaining: 'Requests remaining',
      upgrade: 'Upgrade',
    },
  },
};

export default function Index() {
  const [lang, setLang] = useState<Language>('ru');
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [chatInput, setChatInput] = useState('');

  const t = translations[lang];

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

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    if (!user) {
      toast.error(lang === 'ru' ? 'Войдите в систему' : 'Please log in');
      return;
    }

    const totalRequests = user.daily_requests_remaining + user.bonus_requests;
    if (totalRequests <= 0 && user.role !== 'admin') {
      toast.error(lang === 'ru' ? 'Запросы исчерпаны. Выберите тариф!' : 'Out of requests. Choose a plan!');
      return;
    }

    setChatMessages([...chatMessages, { role: 'user', text: chatInput }]);
    
    setTimeout(() => {
      const aiResponse = lang === 'ru' 
        ? 'Отличный вопрос! Я AI-ассистент NeuroPulse. Могу помочь с учёбой, создать таблицы, написать текст или решить задачу. Как я могу помочь вам сегодня?'
        : 'Great question! I\'m NeuroPulse AI assistant. I can help with studies, create tables, write texts or solve problems. How can I help you today?';
      
      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      
      if (user.role !== 'admin') {
        if (user.bonus_requests > 0) {
          setUser({ ...user, bonus_requests: user.bonus_requests - 1 });
        } else {
          setUser({ ...user, daily_requests_remaining: user.daily_requests_remaining - 1 });
        }
      }
    }, 1000);

    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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

      <main className="container mx-auto px-4 py-12">
        {activeTab === 'home' && (
          <div className="space-y-16">
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

            <Card className="max-w-4xl mx-auto shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name="Bot" size={24} />
                    AI {lang === 'ru' ? 'Помощник' : 'Assistant'}
                  </span>
                  {user && (
                    <Badge variant="secondary">
                      {t.chat.remaining}: {user.daily_requests_remaining + user.bonus_requests}
                      {user.role === 'admin' && ' (∞)'}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {lang === 'ru' 
                    ? 'Задайте любой вопрос — от решения задач до создания таблиц'
                    : 'Ask anything — from solving problems to creating tables'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-[300px] max-h-[400px] overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                      <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>{lang === 'ru' ? 'Начните диалог с AI' : 'Start chatting with AI'}</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          msg.role === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-white border'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder={t.chat.placeholder}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    className="min-h-[60px]"
                  />
                  <Button onClick={handleSendMessage} size="lg">
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'pricing' && (
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
                  <div className="text-4xl font-bold">{t.pricing.starter.price}</div>
                  <div className="text-muted-foreground">{t.pricing.starter.requests}</div>
                  <Button className="w-full" disabled={!user}>
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
                  <div className="text-4xl font-bold">{t.pricing.advanced.price}</div>
                  <div className="text-muted-foreground">{t.pricing.advanced.requests}</div>
                  <Button className="w-full" disabled={!user}>
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
                  <div className="text-4xl font-bold">{t.pricing.unlimited.price}</div>
                  <div className="text-muted-foreground">{t.pricing.unlimited.requests}</div>
                  <Button className="w-full" disabled={!user}>
                    {t.pricing.button}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'founder' && (
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
        )}

        {activeTab === 'profile' && user && (
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
