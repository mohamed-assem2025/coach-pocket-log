import { Payment, Session, Client } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PaymentListGlobalProps {
  payments: Payment[];
  sessions: Session[];
  clients: Client[];
  onAddPayment: () => void;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (paymentId: string) => void;
}

const PaymentListGlobal = ({ payments, sessions, clients, onAddPayment, onEditPayment, onDeletePayment }: PaymentListGlobalProps) => {
  const getSessionInfo = (sessionId: string) => {
    return sessions.find(s => s.id === sessionId);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Payments</h1>
          <p className="text-muted-foreground mt-2">
            Manage all payment records across sessions
          </p>
        </div>
        <Button onClick={onAddPayment} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Payment
        </Button>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by recording your first payment
            </p>
            <Button onClick={onAddPayment} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Payment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => {
            const session = getSessionInfo(payment.sessionId);
            const clientName = session ? getClientName(session.clientId) : 'Unknown Client';
            
            return (
              <Card key={payment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{clientName}</span>
                        {session && (
                          <span className="text-sm text-muted-foreground">
                            Session #{session.sessionNumber}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(payment.paymentDate)}
                        </div>
                        <div className="font-medium text-foreground">
                          {payment.amount} {payment.currency}
                        </div>
                        {payment.paymentMethod && (
                          <div>
                            via {payment.paymentMethod}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditPayment(payment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDeletePayment(payment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentListGlobal;