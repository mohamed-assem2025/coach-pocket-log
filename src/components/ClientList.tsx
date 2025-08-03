import { useState } from 'react';
import { Plus, User, Building, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/types';

interface ClientListProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onAddClient: () => void;
}

export function ClientList({ clients, onSelectClient, onAddClient }: ClientListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Clients</h1>
        <Button onClick={onAddClient} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No clients yet. Add your first client to get started.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{client.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building className="h-4 w-4 mr-2" />
                  {client.company}
                </div>
                <div className="flex items-start text-sm text-muted-foreground">
                  <Target className="h-4 w-4 mr-2 mt-0.5" />
                  <span className="line-clamp-2">{client.coachingGoal}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onSelectClient(client)}
                  className="w-full mt-3"
                >
                  View Sessions
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}