import { Button } from '@/components/ui/button';
import { BarChart3, Users, LogOut } from 'lucide-react';

interface NavigationProps {
  onViewDashboard: () => void;
  onViewClients: () => void;
  currentView: string;
  onSignOut: () => void;
}

const Navigation = ({ onViewDashboard, onViewClients, currentView, onSignOut }: NavigationProps) => {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold">Coaching App</h1>
            
            <div className="flex space-x-4">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'outline'}
                onClick={onViewDashboard}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              
              <Button
                variant={currentView === 'clients' ? 'default' : 'outline'}
                onClick={onViewClients}
              >
                <Users className="h-4 w-4 mr-2" />
                Clients
              </Button>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;