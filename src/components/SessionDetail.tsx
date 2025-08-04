import { ArrowLeft, Calendar, Hash, Target, CheckCircle, Edit, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PaymentList } from '@/components/PaymentList';
import { Client, Session, Payment } from '@/types';

interface SessionDetailProps {
  client: Client;
  session: Session;
  payments: Payment[];
  onBack: () => void;
  onEdit: () => void;
  onAddPayment: () => void;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (paymentId: string) => void;
}

export function SessionDetail({ client, session, payments, onBack, onEdit, onAddPayment, onEditPayment, onDeletePayment }: SessionDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sessions
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Session Details</h1>
          <p className="text-muted-foreground">{client.name} - {client.company}</p>
        </div>
        <Button variant="outline" onClick={onEdit} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Session
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Session {session.sessionNumber}
              </CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(session.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Target className="h-3 w-3" />
              {session.focusArea}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Session Summary</h3>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="whitespace-pre-wrap">{session.summary}</p>
            </div>
          </div>

          {session.actionItems.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Action Items ({session.actionItems.length})
              </h3>
              <div className="space-y-2">
                {session.actionItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-sm flex-1">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Session Pricing */}
          {session.dueAmount && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Session Pricing
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Due Amount</span>
                  <p className="font-medium text-lg">{session.currency} {session.dueAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-4 border-t">
            Session logged on {new Date(session.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Management */}
      <PaymentList
        payments={payments}
        dueAmount={session.dueAmount}
        currency={session.currency}
        onAddPayment={onAddPayment}
        onEditPayment={onEditPayment}
        onDeletePayment={onDeletePayment}
      />
    </div>
  );
}