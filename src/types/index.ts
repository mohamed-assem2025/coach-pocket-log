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
  createdAt: Date;
}