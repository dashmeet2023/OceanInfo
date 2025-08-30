import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Waves, 
  BarChart3, 
  Map, 
  AlertTriangle, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Plus, 
  Bell, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@shared/schema";

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
}

const navigation = [
  { name: 'Dashboard', icon: BarChart3, href: '#', current: true },
  { name: 'Live Map', icon: Map, href: '#map', current: false },
  { name: 'Incidents', icon: AlertTriangle, href: '#incidents', current: false },
  { name: 'Social Monitor', icon: MessageSquare, href: '#social', current: false },
  { name: 'Analytics', icon: TrendingUp, href: '#analytics', current: false },
  { name: 'Reports', icon: FileText, href: '#reports', current: false },
];

const quickActions = [
  { name: 'New Report', icon: Plus, href: '#new-report' },
  { name: 'Alerts', icon: Bell, href: '#alerts' },
];

export default function SidebarNav({ isOpen, onClose, user }: SidebarNavProps) {
  const getUserInitials = (user?: User) => {
    if (!user) return 'U';
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = (user?: User) => {
    if (!user) return 'User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.email) {
      return user.email;
    }
    return 'User';
  };

  const getUserRole = (user?: User) => {
    return user?.role || 'Citizen';
  };

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out",
      "lg:translate-x-0 lg:static lg:inset-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Waves className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">INCOIS</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden" 
          onClick={onClose}
          data-testid="button-close-sidebar"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <nav className="mt-6 px-4 space-y-2 flex-1">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              item.current
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            data-testid={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.name}
          </a>
        ))}
        
        <div className="pt-4 mt-4 border-t border-border">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Actions
          </p>
          {quickActions.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2 mt-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              data-testid={`quick-action-${item.name.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </a>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profileImageUrl || ''} alt={getUserDisplayName(user)} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" data-testid="user-name">
              {getUserDisplayName(user)}
            </p>
            <p className="text-xs text-muted-foreground truncate" data-testid="user-role">
              {getUserRole(user)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
