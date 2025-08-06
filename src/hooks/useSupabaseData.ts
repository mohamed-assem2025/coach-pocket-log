import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Client, Session, Payment } from '@/types';
import { useToast } from './use-toast';

export const useSupabaseData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data when user is authenticated
  useEffect(() => {
    if (user) {
      fetchAllData();
    } else {
      setClients([]);
      setSessions([]);
      setPayments([]);
      setLoading(false);
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchClients(),
        fetchSessions(),
        fetchPayments()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('coach_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      return;
    }

    const mappedClients: Client[] = data.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email || '',
      company: client.company || '',
      coachingGoal: client.coaching_goal || '',
      createdAt: new Date(client.created_at),
    }));

    setClients(mappedClients);
  };

  const fetchSessions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('coach_id', user.id)
      .order('session_date', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      return;
    }

    const mappedSessions: Session[] = data.map(session => ({
      id: session.id,
      clientId: session.client_id,
      date: new Date(session.session_date),
      sessionNumber: session.session_number || 1,
      focusArea: session.focus_area || '',
      summary: session.summary || '',
      actionItems: session.action_items || [],
      dueAmount: session.due_amount ? Number(session.due_amount) : undefined,
      currency: session.currency || 'USD',
      createdAt: new Date(session.created_at),
    }));

    setSessions(mappedSessions);
  };

  const fetchPayments = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('coach_id', user.id)
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return;
    }

    const mappedPayments: Payment[] = data.map(payment => ({
      id: payment.id,
      sessionId: payment.session_id || '',
      amount: Number(payment.amount),
      currency: payment.currency || 'USD',
      paymentDate: new Date(payment.payment_date),
      paymentMethod: payment.payment_method as Payment['paymentMethod'] || 'Bank Transfer',
      notes: payment.notes || undefined,
      createdAt: new Date(payment.created_at),
    }));

    setPayments(mappedPayments);
  };

  // Client CRUD operations
  const saveClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    if (!user) return;

    const { error } = await supabase
      .from('clients')
      .insert({
        coach_id: user.id,
        name: clientData.name,
        email: clientData.email,
        company: clientData.company,
        coaching_goal: clientData.coachingGoal,
      });

    if (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Error",
        description: "Failed to save client. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Client saved successfully!",
    });
    
    fetchClients();
  };

  const deleteClient = async (clientId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)
      .eq('coach_id', user.id);

    if (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Client deleted successfully!",
    });
    
    fetchAllData(); // Refresh all data as sessions and payments might be affected
  };

  // Session CRUD operations
  const saveSession = async (sessionData: Omit<Session, 'id' | 'createdAt'>) => {
    if (!user) return;

    const { error } = await supabase
      .from('sessions')
      .insert({
        coach_id: user.id,
        client_id: sessionData.clientId,
        session_date: sessionData.date.toISOString(),
        session_number: sessionData.sessionNumber,
        focus_area: sessionData.focusArea,
        summary: sessionData.summary,
        action_items: sessionData.actionItems,
        due_amount: sessionData.dueAmount,
        currency: sessionData.currency,
      });

    if (error) {
      console.error('Error saving session:', error);
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Session saved successfully!",
    });
    
    fetchSessions();
  };

  const deleteSession = async (sessionId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', sessionId)
      .eq('coach_id', user.id);

    if (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete session. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Session deleted successfully!",
    });
    
    fetchAllData(); // Refresh all data as payments might be affected
  };

  // Payment CRUD operations
  const savePayment = async (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    if (!user) return;

    // Find the client_id from the session
    const session = sessions.find(s => s.id === paymentData.sessionId);
    if (!session) {
      toast({
        title: "Error",
        description: "Session not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('payments')
      .insert({
        coach_id: user.id,
        client_id: session.clientId,
        session_id: paymentData.sessionId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_date: paymentData.paymentDate.toISOString(),
        payment_method: paymentData.paymentMethod,
        notes: paymentData.notes,
      });

    if (error) {
      console.error('Error saving payment:', error);
      toast({
        title: "Error",
        description: "Failed to save payment. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Payment saved successfully!",
    });
    
    fetchPayments();
  };

  const deletePayment = async (paymentId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', paymentId)
      .eq('coach_id', user.id);

    if (error) {
      console.error('Error deleting payment:', error);
      toast({
        title: "Error",
        description: "Failed to delete payment. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Payment deleted successfully!",
    });
    
    fetchPayments();
  };

  return {
    clients,
    sessions,
    payments,
    loading,
    saveClient,
    deleteClient,
    saveSession,
    deleteSession,
    savePayment,
    deletePayment,
    refetch: fetchAllData,
  };
};