import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import SidebarNav from "@/components/ui/sidebar-nav";
import StatusCards from "@/components/dashboard/status-cards";
import InteractiveMap from "@/components/dashboard/interactive-map";
import ActivityFeed from "@/components/dashboard/activity-feed";
import SocialMonitor from "@/components/dashboard/social-monitor";
import IncidentReports from "@/components/dashboard/incident-reports";
import QuickReportForm from "@/components/dashboard/quick-report-form";
import FloatingActionButton from "@/components/ui/floating-action-button";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Menu, X, Globe } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // WebSocket connection for real-time updates
  const { isConnected, lastMessage } = useWebSocket();

  // Handle unauthorized access
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  // Handle real-time WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        
        switch (data.type) {
          case 'emergency_alert':
            toast({
              title: "🚨 Emergency Alert",
              description: data.message,
              variant: "destructive",
            });
            break;
            
          case 'incident_update':
            toast({
              title: "Incident Update",
              description: data.message,
            });
            break;
            
          case 'stats_update':
            // Stats will be updated automatically via React Query
            break;
            
          default:
            console.log('Unhandled WebSocket message:', data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage, toast]);

  const handleEmergencyReport = () => {
    // TODO: Open emergency report modal
    toast({
      title: "Emergency Report",
      description: "Opening emergency report form...",
    });
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    // TODO: Implement language switching
    toast({
      title: "Language Changed",
      description: `Switched to ${lang === 'en' ? 'English' : 'Hindi'}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <SidebarNav 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-card border-b border-border px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              data-testid="button-open-sidebar"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold hidden sm:block">Ocean Hazard Monitoring</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Live Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-chart-2 animate-pulse' : 'bg-destructive'}`}></div>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {isConnected ? 'Live Monitoring' : 'Disconnected'}
              </span>
            </div>
            
            {/* Emergency Report Button */}
            <Button 
              onClick={handleEmergencyReport}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-emergency-report"
            >
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Emergency Report</span>
              <span className="sm:hidden">Report</span>
            </Button>
            
            {/* Language Selector */}
            <select 
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-1 text-sm"
              data-testid="select-language"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="bn">বাংলা</option>
              <option value="ta">தமிழ்</option>
            </select>
            
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 space-y-6">
          {/* Status Overview Cards */}
          <StatusCards />

          {/* Live Map and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Map */}
            <div className="lg:col-span-2">
              <InteractiveMap />
            </div>
            
            {/* Recent Activity Feed */}
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>
          </div>

          {/* Social Media Monitoring & Incident Reports */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SocialMonitor />
            <IncidentReports />
          </div>

          {/* Quick Report Form */}
          <QuickReportForm />
        </main>
      </div>

      {/* Floating Action Button (Mobile) */}
      <FloatingActionButton onClick={handleEmergencyReport} />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          data-testid="sidebar-overlay"
        />
      )}
    </div>
  );
}
