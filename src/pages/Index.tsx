import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ClientList } from '@/components/ClientList';
import { ClientForm } from '@/components/ClientForm';
import { SessionList } from '@/components/SessionList';
import { SessionForm } from '@/components/SessionForm';
import { SessionDetail } from '@/components/SessionDetail';
import { useToast } from '@/hooks/use-toast';
import { Client, Session } from '@/types';

type View = 'clients' | 'client-form' | 'sessions' | 'session-form' | 'session-detail';

const Index = () => {
  const [clients, setClients] = useLocalStorage<Client[]>('coaching-clients', []);
  const [sessions, setSessions] = useLocalStorage<Session[]>('coaching-sessions', []);
  const [currentView, setCurrentView] = useState<View>('clients');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { toast } = useToast();

  const handleAddClient = () => {
    setCurrentView('client-form');
  };

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setClients([...clients, newClient]);
    setCurrentView('clients');
    toast({
      title: "Client added successfully",
      description: `${newClient.name} has been added to your client list.`
    });
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setCurrentView('sessions');
  };

  const handleAddSession = () => {
    if (selectedClient) {
      setCurrentView('session-form');
    }
  };

  const handleSaveSession = (sessionData: Omit<Session, 'id' | 'createdAt'>) => {
    const newSession: Session = {
      ...sessionData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setSessions([...sessions, newSession]);
    setCurrentView('sessions');
    toast({
      title: "Session logged successfully",
      description: `Session #${newSession.sessionNumber} has been recorded.`
    });
  };

  const handleViewSession = (session: Session) => {
    setSelectedSession(session);
    setCurrentView('session-detail');
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
    setCurrentView('clients');
  };

  const handleBackToSessions = () => {
    setSelectedSession(null);
    setCurrentView('sessions');
  };

  const getClientSessions = (clientId: string) => {
    return sessions.filter(session => session.clientId === clientId);
  };

  const getNextSessionNumber = (clientId: string) => {
    const clientSessions = getClientSessions(clientId);
    return clientSessions.length + 1;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {currentView === 'clients' && (
          <ClientList
            clients={clients}
            onSelectClient={handleSelectClient}
            onAddClient={handleAddClient}
          />
        )}

        {currentView === 'client-form' && (
          <ClientForm
            onSave={handleSaveClient}
            onCancel={() => setCurrentView('clients')}
          />
        )}

        {currentView === 'sessions' && selectedClient && (
          <SessionList
            client={selectedClient}
            sessions={getClientSessions(selectedClient.id)}
            onBack={handleBackToClients}
            onAddSession={handleAddSession}
            onViewSession={handleViewSession}
          />
        )}

        {currentView === 'session-form' && selectedClient && (
          <SessionForm
            client={selectedClient}
            sessionNumber={getNextSessionNumber(selectedClient.id)}
            onSave={handleSaveSession}
            onCancel={handleBackToSessions}
          />
        )}

        {currentView === 'session-detail' && selectedClient && selectedSession && (
          <SessionDetail
            client={selectedClient}
            session={selectedSession}
            onBack={handleBackToSessions}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
