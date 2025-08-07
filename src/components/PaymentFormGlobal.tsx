import { useState } from 'react';
import { DollarSign, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Payment, Session, Client } from '@/types';

interface PaymentFormGlobalProps {
  sessions: Session[];
  clients: Client[];
  onSave: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function PaymentFormGlobal({ sessions, clients, onSave, onCancel }: PaymentFormGlobalProps) {
  const [formData, setFormData] = useState({
    sessionId: '',
    amount: '',
    currency: 'USD',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer' as const,
    notes: ''
  });

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sessionId && formData.amount && formData.paymentDate) {
      onSave({
        sessionId: formData.sessionId,
        amount: Number(formData.amount),
        currency: formData.currency,
        paymentDate: new Date(formData.paymentDate),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes || undefined
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Add Payment
          </CardTitle>
          <p className="text-sm text-muted-foreground">Record a new payment</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionId">Session *</Label>
              <Select
                value={formData.sessionId}
                onValueChange={(value) => setFormData({ ...formData, sessionId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {getClientName(session.clientId)} - Session #{session.sessionNumber}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(session.date)}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="EGP">EGP</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Stripe">Stripe</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes about payment"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Add Payment
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}