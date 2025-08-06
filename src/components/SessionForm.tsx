import { useState } from 'react';
import { X, Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Client, Session } from '@/types';

interface SessionFormProps {
  client: Client;
  sessionNumber: number;
  existingSession?: Session;
  onSave: (session: Omit<Session, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function SessionForm({ client, sessionNumber, existingSession, onSave, onCancel }: SessionFormProps) {
  const [formData, setFormData] = useState({
    date: existingSession ? new Date(existingSession.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    focusArea: existingSession?.focusArea || '',
    summary: existingSession?.summary || '',
    actionItems: existingSession?.actionItems.length ? existingSession.actionItems : [''],
    sessionType: (existingSession?.sessionType || 'Free') as 'Free' | 'Paid' | 'Chemistry',
    dueAmount: existingSession?.dueAmount?.toString() || '',
    currency: existingSession?.currency || 'USD'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.focusArea && formData.summary) {
      const sessionData: Omit<Session, 'id' | 'createdAt'> = {
        clientId: client.id,
        sessionNumber,
        date: new Date(formData.date),
        focusArea: formData.focusArea,
        summary: formData.summary,
        actionItems: formData.actionItems.filter(item => item.trim() !== ''),
        sessionType: formData.sessionType as 'Free' | 'Paid' | 'Chemistry',
        dueAmount: formData.sessionType === 'Paid' && formData.dueAmount ? Number(formData.dueAmount) : undefined,
        currency: formData.sessionType === 'Paid' && formData.dueAmount ? formData.currency : undefined
      };

      onSave(sessionData);
    }
  };

  const addActionItem = () => {
    setFormData({
      ...formData,
      actionItems: [...formData.actionItems, '']
    });
  };

  const removeActionItem = (index: number) => {
    setFormData({
      ...formData,
      actionItems: formData.actionItems.filter((_, i) => i !== index)
    });
  };

  const updateActionItem = (index: number, value: string) => {
    const newItems = [...formData.actionItems];
    newItems[index] = value;
    setFormData({
      ...formData,
      actionItems: newItems
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{existingSession ? 'Edit' : 'New'} Session - {client.name}</CardTitle>
          <p className="text-sm text-muted-foreground">Session #{sessionNumber}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionType">Session Type *</Label>
                <Select
                  value={formData.sessionType}
                  onValueChange={(value) => setFormData({ ...formData, sessionType: value as 'Free' | 'Paid' | 'Chemistry' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="focusArea">Focus Area *</Label>
                <Input
                  id="focusArea"
                  value={formData.focusArea}
                  onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                  placeholder="e.g., Leadership, Communication, Strategy"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="summary">Session Summary *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="What was discussed in this session? Key insights and outcomes..."
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Action Items</Label>
                <Button type="button" variant="outline" size="sm" onClick={addActionItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              {formData.actionItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateActionItem(index, e.target.value)}
                    placeholder="What action will the client take?"
                    className="flex-1"
                  />
                  {formData.actionItems.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeActionItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Separator className="my-6" />
            
            {/* Pricing Section */}
            {formData.sessionType === 'Paid' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <Label className="text-base font-medium">Session Pricing</Label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueAmount">Due Amount *</Label>
                    <Input
                      id="dueAmount"
                      type="number"
                      step="0.01"
                      value={formData.dueAmount}
                      onChange={(e) => setFormData({ ...formData, dueAmount: e.target.value })}
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
              </div>
            )}
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Save Session
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