import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { ClientList } from '@/components/ClientList';
import { ClientForm } from '@/components/ClientForm';
import { SessionList } from '@/components/SessionList';
import { SessionForm } from '@/components/SessionForm';
import { SessionDetail } from '@/components/SessionDetail';
import { PaymentForm } from '@/components/PaymentForm';
import { useToast } from '@/hooks/use-toast';
import { Client, Session, Payment } from '@/types';

type MainView = 'dashboard' | 'clients';
type SubView = 'client-form' | 'sessions' | 'session-form' | 'session-detail' | 'session-edit' | 'payment-form' | 'payment-edit';

const Index = () => {
  const [clients, setClients] = useLocalStorage<Client[]>('coaching-clients', []);
  const [sessions, setSessions] = useLocalStorage<Session[]>('coaching-sessions', []);
  const [payments, setPayments] = useLocalStorage<Payment[]>('coaching-payments', []);
  const [mainView, setMainView] = useState<MainView>('dashboard');
  const [subView, setSubView] = useState<SubView | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { toast } = useToast();

  const handleMainViewChange = (view: MainView) => {
    setMainView(view);
    setSubView(null);
    setSelectedClient(null);
    setSelectedSession(null);
    setSelectedPayment(null);
  };

  const handleAddClient = () => {
    setSubView('client-form');
  };

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setClients([...clients, newClient]);
    setMainView('clients');
    setSubView(null);
    toast({
      title: "Client added successfully",
      description: `${newClient.name} has been added to your client list.`
    });
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setSubView('sessions');
  };

  const handleAddSession = () => {
    if (selectedClient) {
      setSubView('session-form');
    }
  };

  const handleSaveSession = (sessionData: Omit<Session, 'id' | 'createdAt'>) => {
    const newSession: Session = {
      ...sessionData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setSessions([...sessions, newSession]);
    setSubView('sessions');
    toast({
      title: "Session logged successfully",
      description: `Session #${newSession.sessionNumber} has been recorded.`
    });
  };

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setSubView('session-edit');
  };

  const handleUpdateSession = (sessionData: Omit<Session, 'id' | 'createdAt'>) => {
    if (selectedSession) {
      const updatedSession: Session = {
        ...sessionData,
        id: selectedSession.id,
        createdAt: selectedSession.createdAt
      };
      setSessions(sessions.map(s => s.id === selectedSession.id ? updatedSession : s));
      setSubView('session-detail');
      toast({
        title: "Session updated successfully",
        description: `Session #${updatedSession.sessionNumber} has been updated.`
      });
    }
  };

  const handleViewSession = (session: Session) => {
    setSelectedSession(session);
    setSubView('session-detail');
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
    setMainView('clients');
    setSubView(null);
  };

  const handleBackToSessions = () => {
    setSelectedSession(null);
    setSelectedPayment(null);
    setSubView('sessions');
  };

  const getClientSessions = (clientId: string) => {
    return sessions.filter(session => session.clientId === clientId);
  };

  // Payment handlers
  const handleAddPayment = () => {
    setSubView('payment-form');
  };

  const handleSavePayment = (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    setPayments([...payments, newPayment]);
    setSubView('session-detail');
    toast({
      title: "Payment recorded successfully",
      description: `Payment of ${paymentData.currency} ${paymentData.amount} has been recorded.`
    });
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setSubView('payment-edit');
  };

  const handleUpdatePayment = (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    if (selectedPayment) {
      const updatedPayment: Payment = {
        ...paymentData,
        id: selectedPayment.id,
        createdAt: selectedPayment.createdAt
      };
      setPayments(payments.map(p => p.id === selectedPayment.id ? updatedPayment : p));
      setSubView('session-detail');
      toast({
        title: "Payment updated successfully",
        description: `Payment has been updated.`
      });
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    setPayments(payments.filter(p => p.id !== paymentId));
    toast({
      title: "Payment deleted",
      description: "Payment record has been removed."
    });
  };

  const getSessionPayments = (sessionId: string) => {
    return payments.filter(payment => payment.sessionId === sessionId);
  };

  const getNextSessionNumber = (clientId: string) => {
    const clientSessions = getClientSessions(clientId);
    return clientSessions.length + 1;
  };

  // Determine if we should show navigation (not in sub-views)
  const showNavigation = !subView;

  return (
    <div className="min-h-screen bg-background">
      {showNavigation && (
        <Navigation
          currentView={mainView}
          onViewChange={handleMainViewChange}
        />
      )}
      
      <div className="container mx-auto px-4 py-8">
        {/* Main views */}
        {mainView === 'dashboard' && !subView && (
        <Dashboard
          clients={clients}
          sessions={sessions}
          payments={payments}
          onViewClients={() => handleMainViewChange('clients')}
        />
        )}

        {mainView === 'clients' && !subView && (
          <ClientList
            clients={clients}
            onSelectClient={handleSelectClient}
            onAddClient={handleAddClient}
          />
        )}

        {/* Sub views */}
        {subView === 'client-form' && (
          <ClientForm
            onSave={handleSaveClient}
            onCancel={() => setSubView(null)}
          />
        )}

        {subView === 'sessions' && selectedClient && (
          <SessionList
            client={selectedClient}
            sessions={getClientSessions(selectedClient.id)}
            onBack={handleBackToClients}
            onAddSession={handleAddSession}
            onViewSession={handleViewSession}
          />
        )}

        {subView === 'session-form' && selectedClient && (
          <SessionForm
            client={selectedClient}
            sessionNumber={getNextSessionNumber(selectedClient.id)}
            onSave={handleSaveSession}
            onCancel={handleBackToSessions}
          />
        )}

        {subView === 'session-detail' && selectedClient && selectedSession && (
        <SessionDetail
          client={selectedClient}
          session={selectedSession}
          payments={getSessionPayments(selectedSession.id)}
          onBack={handleBackToSessions}
          onEdit={() => handleEditSession(selectedSession)}
          onAddPayment={handleAddPayment}
          onEditPayment={handleEditPayment}
          onDeletePayment={handleDeletePayment}
        />
        )}

        {subView === 'session-edit' && selectedClient && selectedSession && (
          <SessionForm
            client={selectedClient}
            sessionNumber={selectedSession.sessionNumber}
            existingSession={selectedSession}
            onSave={handleUpdateSession}
            onCancel={() => setSubView('session-detail')}
        />
        )}

        {subView === 'payment-form' && selectedSession && (
          <PaymentForm
            sessionId={selectedSession.id}
            defaultCurrency={selectedSession.currency}
            onSave={handleSavePayment}
            onCancel={handleBackToSessions}
          />
        )}

        {subView === 'payment-edit' && selectedPayment && (
          <PaymentForm
            sessionId={selectedPayment.sessionId}
            existingPayment={selectedPayment}
            onSave={handleUpdatePayment}
            onCancel={() => setSubView('session-detail')}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
