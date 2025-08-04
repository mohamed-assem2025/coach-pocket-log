import { BarChart3, Users, Calendar, Target, Clock, TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Client, Session } from '@/types';

interface DashboardProps {
  clients: Client[];
  sessions: Session[];
  onViewClients: () => void;
}

export function Dashboard({ clients, sessions, onViewClients }: DashboardProps) {
  // Calculate stats
  const totalClients = clients.length;
  const totalSessions = sessions.length;
  const averageSessionsPerClient = totalClients > 0 ? (totalSessions / totalClients).toFixed(1) : '0';
  
  // Recent sessions (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentSessions = sessions.filter(session => new Date(session.date) >= sevenDaysAgo);
  
  // This month's sessions
  const thisMonth = new Date();
  const firstDayOfMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
  const thisMonthSessions = sessions.filter(session => new Date(session.date) >= firstDayOfMonth);
  
  // Most active clients (by session count)
  const clientSessionCounts = clients.map(client => ({
    client,
    sessionCount: sessions.filter(session => session.clientId === client.id).length,
    lastSession: sessions
      .filter(session => session.clientId === client.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
  })).sort((a, b) => b.sessionCount - a.sessionCount);

  // Focus areas breakdown
  const focusAreas = sessions.reduce((acc, session) => {
    acc[session.focusArea] = (acc[session.focusArea] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topFocusAreas = Object.entries(focusAreas)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Payment statistics
  const paidSessions = sessions.filter(session => session.payment);
  const totalRevenue = paidSessions.reduce((sum, session) => sum + (session.payment?.amount || 0), 0);
  const thisMonthRevenue = paidSessions
    .filter(session => new Date(session.date) >= firstDayOfMonth)
    .reduce((sum, session) => sum + (session.payment?.amount || 0), 0);

  // Payment methods breakdown
  const paymentMethods = paidSessions.reduce((acc, session) => {
    if (session.payment) {
      acc[session.payment.paymentMethod] = (acc[session.payment.paymentMethod] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Recent payments
  const recentPayments = paidSessions
    .sort((a, b) => new Date(b.payment!.paymentDate).getTime() - new Date(a.payment!.paymentDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Your coaching practice overview</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Active coaching relationships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              Sessions completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {paidSessions.length} paid sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${thisMonthRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {thisMonthSessions.length} sessions this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent sessions</p>
            ) : (
              <div className="space-y-3">
                {recentSessions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((session) => {
                    const client = clients.find(c => c.id === session.clientId);
                    return (
                      <div key={session.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{client?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Session #{session.sessionNumber} • {session.focusArea}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Focus Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topFocusAreas.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No sessions yet</p>
            ) : (
              <div className="space-y-3">
                {topFocusAreas.map(([area, count]) => (
                  <div key={area} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{area}</span>
                    <Badge variant="secondary">{count} session{count !== 1 ? 's' : ''}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(paymentMethods).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No payments yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(paymentMethods)
                  .sort(([,a], [,b]) => b - a)
                  .map(([method, count]) => (
                    <div key={method} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{method}</span>
                      <Badge variant="outline">{count} payment{count !== 1 ? 's' : ''}</Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      {recentPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPayments.map((session) => {
                const client = clients.find(c => c.id === session.clientId);
                return (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{client?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Session #{session.sessionNumber} • {session.payment!.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{session.payment!.currency} {session.payment!.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.payment!.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client Overview */}
      {clientSessionCounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Client Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientSessionCounts.slice(0, 5).map(({ client, sessionCount, lastSession }) => (
                <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.company}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{sessionCount} session{sessionCount !== 1 ? 's' : ''}</Badge>
                    {lastSession && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last: {new Date(lastSession.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}