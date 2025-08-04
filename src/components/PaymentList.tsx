import { Plus, Edit, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Payment } from '@/types';

interface PaymentListProps {
  payments: Payment[];
  dueAmount?: number;
  currency?: string;
  onAddPayment: () => void;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (paymentId: string) => void;
}

export function PaymentList({ 
  payments, 
  dueAmount, 
  currency = 'USD', 
  onAddPayment, 
  onEditPayment, 
  onDeletePayment 
}: PaymentListProps) {
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = (dueAmount || 0) - totalPaid;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onAddPayment}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Summary */}
        {dueAmount && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Due Amount</span>
                <p className="font-medium">{currency} {dueAmount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Paid</span>
                <p className="font-medium">{currency} {totalPaid.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Balance</span>
                <p className={`font-medium ${remainingBalance <= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {currency} {remainingBalance.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="pt-2">
              <Badge variant={remainingBalance <= 0 ? 'default' : 'secondary'}>
                {remainingBalance <= 0 ? 'Fully Paid' : 'Partial Payment'}
              </Badge>
            </div>
          </div>
        )}

        {/* Payment List */}
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payments recorded yet</p>
            <Button variant="outline" onClick={onAddPayment} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add First Payment
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {payments
              .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
              .map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{payment.currency} {payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}
                        </p>
                        {payment.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{payment.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPayment(payment)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeletePayment(payment.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}