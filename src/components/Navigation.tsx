import { BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentView: 'dashboard' | 'clients';
  onViewChange: (view: 'dashboard' | 'clients') => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center space-x-4 lg:space-x-6">
          <div className="font-bold text-lg">CoachTracker</div>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('dashboard')}
              className={cn(
                "gap-2",
                currentView === 'dashboard' && "bg-primary text-primary-foreground"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={currentView === 'clients' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange('clients')}
              className={cn(
                "gap-2",
                currentView === 'clients' && "bg-primary text-primary-foreground"
              )}
            >
              <Users className="h-4 w-4" />
              Clients
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}