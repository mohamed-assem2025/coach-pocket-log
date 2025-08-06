export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  coachingGoal: string;
  createdAt: Date;
}

export interface Session {
  id: string;
  clientId: string;
  date: Date;
  sessionNumber: number;
  focusArea: string;
  summary: string;
  actionItems: string[];
  sessionType?: 'Free' | 'Paid' | 'Chemistry';
  dueAmount?: number;
  currency?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  sessionId: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'PayPal' | 'Stripe' | 'Other';
  notes?: string;
  createdAt: Date;
}