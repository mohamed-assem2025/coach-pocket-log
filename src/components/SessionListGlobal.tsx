import { Session, Client } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SessionListGlobalProps {
  sessions: Session[];
  clients: Client[];
  onBack: () => void;
  onAddSession: () => void;
  onViewSession: (session: Session) => void;
}

const SessionListGlobal = ({ sessions, clients, onBack, onAddSession, onViewSession }: SessionListGlobalProps) => {
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  };

  const getSessionTypeColor = (sessionType: string) => {
    switch (sessionType) {
      case 'Free':
        return 'bg-green-100 text-green-800';
      case 'Paid':
        return 'bg-blue-100 text-blue-800';
      case 'Chemistry':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Sessions</h1>
          <p className="text-muted-foreground mt-2">
            Manage all coaching sessions across clients
          </p>
        </div>
        <Button onClick={onAddSession} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by creating your first coaching session
            </p>
            <Button onClick={onAddSession} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{getClientName(session.clientId)}</span>
                      <Badge className={getSessionTypeColor(session.sessionType)}>
                        {session.sessionType}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Session #{session.sessionNumber}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(session.date)}
                      </div>
                      {session.sessionType === 'Paid' && session.dueAmount && (
                        <div className="font-medium text-foreground">
                          {session.dueAmount} {session.currency}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => onViewSession(session)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionListGlobal;