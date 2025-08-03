import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Client } from '@/types';

interface ClientFormProps {
  onSave: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function ClientForm({ onSave, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    coachingGoal: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.company && formData.coachingGoal) {
      onSave(formData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Client name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@company.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coachingGoal">Coaching Goal *</Label>
              <Textarea
                id="coachingGoal"
                value={formData.coachingGoal}
                onChange={(e) => setFormData({ ...formData, coachingGoal: e.target.value })}
                placeholder="What are the main coaching objectives for this client?"
                rows={3}
                required
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Save Client
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