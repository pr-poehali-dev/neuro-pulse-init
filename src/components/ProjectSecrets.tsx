import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Language } from '@/lib/translations';

interface ProjectSecretsProps {
  lang: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Secret {
  id: string;
  name: string;
  value: string;
  description: string;
}

export default function ProjectSecrets({ lang, open, onOpenChange }: ProjectSecretsProps) {
  const [secrets, setSecrets] = useState<Secret[]>([
    { 
      id: '1', 
      name: 'YUKASSA_SHOP_ID', 
      value: '', 
      description: lang === 'ru' ? 'Shop ID из личного кабинета ЮKassa' : 'Shop ID from YooKassa dashboard'
    },
    { 
      id: '2', 
      name: 'YUKASSA_SECRET_KEY', 
      value: '', 
      description: lang === 'ru' ? 'Секретный ключ ЮKassa для API' : 'YooKassa secret key for API'
    },
    { 
      id: '3', 
      name: 'OPENAI_API_KEY', 
      value: '', 
      description: lang === 'ru' ? 'API ключ OpenAI для ChatGPT' : 'OpenAI API key for ChatGPT'
    },
    { 
      id: '4', 
      name: 'DATABASE_URL', 
      value: '', 
      description: lang === 'ru' ? 'PostgreSQL подключение к базе данных' : 'PostgreSQL database connection string'
    },
    { 
      id: '5', 
      name: 'JWT_SECRET', 
      value: '', 
      description: lang === 'ru' ? 'Секретный ключ для JWT токенов' : 'Secret key for JWT tokens'
    }
  ]);

  const [showValues, setShowValues] = useState<Record<string, boolean>>({});

  const handleSave = () => {
    toast.success(lang === 'ru' ? 'Секреты сохранены!' : 'Secrets saved!');
  };

  const handleValueChange = (id: string, value: string) => {
    setSecrets(secrets.map(s => s.id === id ? { ...s, value } : s));
  };

  const toggleShowValue = (id: string) => {
    setShowValues({ ...showValues, [id]: !showValues[id] });
  };

  const handleAddNew = () => {
    const newId = String(secrets.length + 1);
    setSecrets([
      ...secrets,
      {
        id: newId,
        name: lang === 'ru' ? 'НОВЫЙ_СЕКРЕТ' : 'NEW_SECRET',
        value: '',
        description: lang === 'ru' ? 'Описание нового секрета' : 'New secret description'
      }
    ]);
  };

  const handleDelete = (id: string) => {
    setSecrets(secrets.filter(s => s.id !== id));
    toast.success(lang === 'ru' ? 'Секрет удалён' : 'Secret deleted');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Key" size={24} />
            {lang === 'ru' ? 'Секреты проекта' : 'Project Secrets'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <Icon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>{lang === 'ru' ? 'Важно:' : 'Important:'}</strong>{' '}
              {lang === 'ru' 
                ? 'Никогда не делитесь этими ключами. Они дают полный доступ к вашим сервисам и платежам.'
                : 'Never share these keys. They provide full access to your services and payments.'}
            </div>
          </div>

          {secrets.map((secret) => (
            <Card key={secret.id} className="border-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Lock" size={18} />
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {secret.name}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(secret.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{secret.description}</p>
                
                <div className="space-y-2">
                  <Label htmlFor={`secret-${secret.id}`}>
                    {lang === 'ru' ? 'Значение' : 'Value'}
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id={`secret-${secret.id}`}
                        type={showValues[secret.id] ? 'text' : 'password'}
                        value={secret.value}
                        onChange={(e) => handleValueChange(secret.id, e.target.value)}
                        placeholder={lang === 'ru' ? 'Введите ключ...' : 'Enter key...'}
                        className="font-mono text-sm pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => toggleShowValue(secret.id)}
                      >
                        <Icon name={showValues[secret.id] ? 'EyeOff' : 'Eye'} size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" className="w-full" onClick={handleAddNew}>
            <Icon name="Plus" size={18} className="mr-2" />
            {lang === 'ru' ? 'Добавить новый секрет' : 'Add New Secret'}
          </Button>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1" size="lg" onClick={handleSave}>
              <Icon name="Save" size={18} className="mr-2" />
              {lang === 'ru' ? 'Сохранить все' : 'Save All'}
            </Button>
            <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              {lang === 'ru' ? 'Отмена' : 'Cancel'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
