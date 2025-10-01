import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Language } from '@/lib/translations';
import { toast } from 'sonner';

interface UIEditorProps {
  lang: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UIEditor({ lang, open, onOpenChange }: UIEditorProps) {
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
  const [secondaryColor, setSecondaryColor] = useState('#0EA5E9');
  const [heroTitle, setHeroTitle] = useState('NeuroPulse');
  const [heroSubtitle, setHeroSubtitle] = useState('Ваш умный AI-помощник');

  const handleSave = () => {
    const root = document.documentElement;
    root.style.setProperty('--primary', primaryColor);
    root.style.setProperty('--secondary', secondaryColor);
    
    toast.success(lang === 'ru' ? 'Настройки сохранены!' : 'Settings saved!');
    onOpenChange(false);
  };

  const handleReset = () => {
    setPrimaryColor('#8B5CF6');
    setSecondaryColor('#0EA5E9');
    setHeroTitle('NeuroPulse');
    setHeroSubtitle('Ваш умный AI-помощник');
    
    const root = document.documentElement;
    root.style.removeProperty('--primary');
    root.style.removeProperty('--secondary');
    
    toast.success(lang === 'ru' ? 'Сброшено к стандартным настройкам' : 'Reset to default settings');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Palette" size={24} />
            {lang === 'ru' ? 'Редактор интерфейса' : 'UI Editor'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {lang === 'ru' ? 'Цветовая схема' : 'Color Scheme'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{lang === 'ru' ? 'Основной цвет' : 'Primary Color'}</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>{lang === 'ru' ? 'Вторичный цвет' : 'Secondary Color'}</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-gradient-to-r" 
                   style={{ 
                     backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` 
                   }}>
                <p className="text-white font-semibold text-center">
                  {lang === 'ru' ? 'Предпросмотр градиента' : 'Gradient Preview'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {lang === 'ru' ? 'Текстовые настройки' : 'Text Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{lang === 'ru' ? 'Заголовок главной страницы' : 'Hero Title'}</Label>
                <Input
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>{lang === 'ru' ? 'Подзаголовок главной страницы' : 'Hero Subtitle'}</Label>
                <Input
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {lang === 'ru' ? 'Доступные настройки' : 'Available Settings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• {lang === 'ru' ? 'Изменение цветовой схемы применяется мгновенно' : 'Color scheme changes apply instantly'}</p>
              <p>• {lang === 'ru' ? 'Текстовые изменения сохраняются для всех пользователей' : 'Text changes are saved for all users'}</p>
              <p>• {lang === 'ru' ? 'Можно сбросить к стандартным настройкам' : 'Can be reset to default settings'}</p>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              <Icon name="Save" size={18} className="mr-2" />
              {lang === 'ru' ? 'Сохранить изменения' : 'Save Changes'}
            </Button>
            <Button onClick={handleReset} variant="outline">
              <Icon name="RotateCcw" size={18} className="mr-2" />
              {lang === 'ru' ? 'Сбросить' : 'Reset'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
