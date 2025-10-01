import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Language, translations } from '@/lib/translations';
import { User, ChatMessage } from '@/lib/types';

interface AIChatProps {
  lang: Language;
  user: User | null;
  setUser: (user: User) => void;
}

export default function AIChat({ lang, user, setUser }: AIChatProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = translations[lang];

  const handleSendMessage = async () => {
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

    const userMessage = chatInput;
    setChatMessages([...chatMessages, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/6e0a0309-4aa9-4c07-8931-d021be6617cb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          userId: user.id,
          language: lang 
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        toast.error(data.error);
        setChatMessages(prev => prev.slice(0, -1));
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', text: data.response }]);
        
        if (user.role !== 'admin') {
          if (user.bonus_requests > 0) {
            setUser({ ...user, bonus_requests: user.bonus_requests - 1 });
          } else {
            setUser({ ...user, daily_requests_remaining: user.daily_requests_remaining - 1 });
          }
        }
      }
    } catch (error) {
      toast.error(lang === 'ru' ? 'Ошибка сервера' : 'Server error');
      setChatMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-white border">
                <Icon name="Loader2" size={20} className="animate-spin" />
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Textarea
            placeholder={t.chat.placeholder}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
            className="min-h-[60px]"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} size="lg" disabled={isLoading}>
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}