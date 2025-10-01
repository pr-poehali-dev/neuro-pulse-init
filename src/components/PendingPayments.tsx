import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Language } from '@/lib/translations';

interface PendingPaymentsProps {
  lang: Language;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Payment {
  id: string;
  userId: number;
  userName: string;
  tariffType: string;
  amount: number;
  currency: string;
  senderName: string;
  paymentProof: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function PendingPayments({ lang, open, onOpenChange }: PendingPaymentsProps) {
  const [payments, setPayments] = useState<Payment[]>([]);

  const handleApprove = (paymentId: string) => {
    setPayments(payments.map(p => 
      p.id === paymentId ? { ...p, status: 'approved' as const } : p
    ));
    toast.success(lang === 'ru' ? 'Платёж одобрен! Запросы начислены.' : 'Payment approved! Requests added.');
  };

  const handleReject = (paymentId: string) => {
    setPayments(payments.map(p => 
      p.id === paymentId ? { ...p, status: 'rejected' as const } : p
    ));
    toast.success(lang === 'ru' ? 'Платёж отклонён' : 'Payment rejected');
  };

  const pendingCount = payments.filter(p => p.status === 'pending').length;

  const tariffNames: Record<string, { ru: string; en: string; requests: string }> = {
    starter: { ru: 'Стартовый', en: 'Starter', requests: '20' },
    advanced: { ru: 'Продвинутый', en: 'Advanced', requests: '40' },
    unlimited: { ru: 'Безлимит', en: 'Unlimited', requests: '∞' }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Receipt" size={24} />
            {lang === 'ru' ? 'Ожидающие платежи' : 'Pending Payments'}
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingCount}</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {payments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-50" />
                <p>{lang === 'ru' ? 'Нет ожидающих платежей' : 'No pending payments'}</p>
              </CardContent>
            </Card>
          ) : (
            payments.map((payment) => (
              <Card key={payment.id} className={
                payment.status === 'pending' ? 'border-2 border-orange-500' :
                payment.status === 'approved' ? 'border-green-500 opacity-60' :
                'border-red-500 opacity-60'
              }>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon name="User" size={16} />
                        {payment.userName}
                        <span className="text-muted-foreground text-sm font-normal">
                          (ID: {payment.userId})
                        </span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(payment.createdAt).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')}
                      </p>
                    </div>
                    <Badge variant={
                      payment.status === 'pending' ? 'default' :
                      payment.status === 'approved' ? 'outline' : 'destructive'
                    }>
                      {payment.status === 'pending' && (lang === 'ru' ? 'Ожидает' : 'Pending')}
                      {payment.status === 'approved' && (lang === 'ru' ? 'Одобрен' : 'Approved')}
                      {payment.status === 'rejected' && (lang === 'ru' ? 'Отклонён' : 'Rejected')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{lang === 'ru' ? 'Тариф' : 'Tariff'}</p>
                      <p className="font-semibold">
                        {lang === 'ru' ? tariffNames[payment.tariffType]?.ru : tariffNames[payment.tariffType]?.en}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tariffNames[payment.tariffType]?.requests} {lang === 'ru' ? 'запросов' : 'requests'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{lang === 'ru' ? 'Сумма' : 'Amount'}</p>
                      <p className="font-semibold text-lg">{payment.amount} {payment.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{lang === 'ru' ? 'Имя отправителя' : 'Sender name'}</p>
                      <p className="font-semibold">{payment.senderName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{lang === 'ru' ? 'Последние 4 цифры' : 'Last 4 digits'}</p>
                      <p className="font-semibold font-mono">{payment.paymentProof || '—'}</p>
                    </div>
                  </div>

                  {payment.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1" 
                        onClick={() => handleApprove(payment.id)}
                      >
                        <Icon name="CheckCircle" size={18} className="mr-2" />
                        {lang === 'ru' ? 'Одобрить и начислить' : 'Approve & Add Requests'}
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleReject(payment.id)}
                      >
                        <Icon name="XCircle" size={18} className="mr-2" />
                        {lang === 'ru' ? 'Отклонить' : 'Reject'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="border-t pt-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {lang === 'ru' ? 'Всего платежей:' : 'Total payments:'} {payments.length}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {lang === 'ru' ? 'Закрыть' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}