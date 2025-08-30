import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  Activity,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export default function StatusCards() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive">Failed to load statistics</p>
        </CardContent>
      </Card>
    );
  }

  const getThreatLevel = () => {
    if (!stats) return { level: 'UNKNOWN', color: 'bg-muted', textColor: 'text-muted-foreground' };
    
    const { criticalIncidents, activeIncidents } = stats;
    
    if (criticalIncidents > 0) {
      return { level: 'CRITICAL', color: 'bg-destructive', textColor: 'text-destructive-foreground' };
    } else if (activeIncidents > 5) {
      return { level: 'HIGH', color: 'bg-chart-3', textColor: 'text-white' };
    } else if (activeIncidents > 2) {
      return { level: 'MODERATE', color: 'bg-chart-3', textColor: 'text-white' };
    } else {
      return { level: 'LOW', color: 'bg-chart-2', textColor: 'text-white' };
    }
  };

  const threatLevel = getThreatLevel();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Threat Level */}
      <Card className="relative overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Threat Level</p>
              <Badge 
                className={`${threatLevel.color} ${threatLevel.textColor} px-3 py-1 text-sm font-bold mt-2`}
                data-testid="threat-level"
              >
                {threatLevel.level}
              </Badge>
            </div>
            <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-chart-3" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Last updated: <span data-testid="last-update">2 minutes ago</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Active Incidents */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Incidents</p>
              <p className="text-3xl font-bold text-foreground mt-2" data-testid="active-incidents">
                {stats?.activeIncidents || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-chart-1/10 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-chart-1" />
            </div>
          </div>
          <div className="mt-4 flex space-x-4 text-xs">
            <span className="text-destructive flex items-center">
              • <span className="ml-1" data-testid="critical-incidents">
                {stats?.criticalIncidents || 0} Critical
              </span>
            </span>
            <span className="text-chart-3 flex items-center">
              • <span className="ml-1" data-testid="moderate-incidents">
                {stats?.moderateIncidents || 0} Moderate
              </span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Citizens Reporting */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Citizen Reports Today</p>
              <p className="text-3xl font-bold text-foreground mt-2" data-testid="today-reports">
                {stats?.todayReports || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-chart-2" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="w-3 h-3 text-chart-2" />
              <span className="text-chart-2">+23% from yesterday</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Activity */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Social Media Mentions</p>
              <p className="text-3xl font-bold text-foreground mt-2" data-testid="social-mentions">
                {stats?.socialMentions || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-chart-5/10 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-chart-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Sentiment: <span className="text-chart-3 font-medium">Concerned</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
