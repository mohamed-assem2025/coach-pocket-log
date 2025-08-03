import { useState } from 'react';
import { ArrowLeft, Plus, Calendar, Hash, Target, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Client, Session } from '@/types';

interface SessionListProps {
  client: Client;
  sessions: Session[];
  onBack: () => void;
  onAddSession: () => void;
  onViewSession: (session: Session) => void;
}

export function SessionList({ client, sessions, onBack, onAddSession, onViewSession }: SessionListProps) {
  const [filter, setFilter] = useState('');
  
  const filteredSessions = sessions.filter(session => 
    session.focusArea.toLowerCase().includes(filter.toLowerCase()) ||
    session.summary.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedSessions = filteredSessions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
          <p className="text-muted-foreground">{client.company}</p>
        </div>
        <Button onClick={onAddSession} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Session
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Coaching Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{client.coachingGoal}</p>
        </CardContent>
      </Card>

      <div>
        <Input
          placeholder="Filter sessions by focus area or summary..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-md"
        />
      </div>

      {sortedSessions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sessions yet. Add your first session to get started.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedSessions.map((session) => (
            <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(session.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-1" />
                      Session {session.sessionNumber}
                    </div>
                  </div>
                  <Badge variant="secondary">{session.focusArea}</Badge>
                </div>
                
                <h3 className="font-semibold mb-2">Session Summary</h3>
                <p className="text-muted-foreground line-clamp-2 mb-4">{session.summary}</p>
                
                {session.actionItems.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Action Items ({session.actionItems.length})</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {session.actionItems.slice(0, 2).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                      {session.actionItems.length > 2 && (
                        <li className="text-xs">+{session.actionItems.length - 2} more items</li>
                      )}
                    </ul>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onViewSession(session)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}