import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Client, Session, Payment } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import Navigation from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { ClientList } from '@/components/ClientList';
import ClientForm from '@/components/ClientForm';
import { SessionList } from '@/components/SessionList';
import { SessionForm } from '@/components/SessionForm';
import { SessionDetail } from '@/components/SessionDetail';
import { PaymentForm } from '@/components/PaymentForm';
import { Loader2 } from 'lucide-react';

type MainView = 'dashboard' | 'clients';
type SubView = 'client-form' | 'sessions' | 'session-form' | 'session-detail' | 'session-edit' | 'payment-form' | 'payment-edit';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    clients, 
    sessions, 
    payments, 
    loading: dataLoading,
    saveClient,
    deleteClient,
    saveSession,
    deleteSession,
    savePayment,
    deletePayment,
  } = useSupabaseData();

  // View state
  const [mainView, setMainView] = useState<MainView>('dashboard');
  const [subView, setSubView] = useState<SubView | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Redirect to auth if not authenticated
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading spinner while checking auth state or loading data
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Navigation handlers
  const handleMainViewChange = (view: MainView) => {
    setMainView(view);
    setSubView(null);
    setSelectedClient(null);
    setSelectedSession(null);
    setSelectedPayment(null);
  };

  // Client handlers
  const handleAddClient = () => {
    setSubView('client-form');
  };

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    saveClient(clientData);
    setMainView('clients');
    setSubView(null);
  };

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setSubView('sessions');
  };

  // Session handlers
  const handleAddSession = () => {
    if (selectedClient) {
      setSubView('session-form');
    }
  };

  const handleSaveSession = (sessionData: Omit<Session, 'id' | 'createdAt'>) => {
    saveSession(sessionData);
    setSubView('sessions');
  };

  const handleViewSession = (session: Session) => {
    setSelectedSession(session);
    setSubView('session-detail');
  };

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setSubView('session-edit');
  };

  const handleUpdateSession = (sessionData: Omit<Session, 'id' | 'createdAt'>) => {
    if (selectedSession) {
      // For updates, we'd need to implement an update method in useSupabaseData
      // For now, just go back to session detail
      setSubView('session-detail');
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
  };

  // Payment handlers
  const handleAddPayment = () => {
    setSubView('payment-form');
  };

  const handleSavePayment = (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    savePayment(paymentData);
    setSubView('session-detail');
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setSubView('payment-edit');
  };

  const handleUpdatePayment = (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    if (selectedPayment) {
      // For updates, we'd need to implement an update method in useSupabaseData
      // For now, just go back to session detail
      setSubView('session-detail');
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    deletePayment(paymentId);
  };

  // Navigation helpers
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

  // Data helpers
  const getClientSessions = (clientId: string) => {
    return sessions.filter(session => session.clientId === clientId);
  };

  const getSessionPayments = (sessionId: string) => {
    return payments.filter(payment => payment.sessionId === sessionId);
  };

  const getNextSessionNumber = (clientId: string) => {
    const clientSessions = getClientSessions(clientId);
    return clientSessions.length + 1;
  };

  return (
    <div className="min-h-screen bg-background">
      {!subView && (
        <Navigation 
          onViewDashboard={() => handleMainViewChange('dashboard')}
          onViewClients={() => handleMainViewChange('clients')}
          currentView={mainView}
          onSignOut={signOut}
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