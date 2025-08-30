import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Users, MessageSquare, TrendingUp, RefreshCw } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'incident' | 'report' | 'social';
  title: string;
  severity: string;
  timestamp: string;
  location?: string;
  source?: string;
}

export default function ActivityFeed() {
  const { data: activities, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/activity'],
    refetchInterval: 30000, // RefreshCw every 30 seconds
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'incident': return AlertTriangle;
      case 'report': return Users;
      case 'social': return MessageSquare;
      default: return TrendingUp;
    }
  };

  const getActivityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive';
      case 'high': return 'bg-chart-3';
      case 'moderate': return 'bg-chart-3';
      case 'low': return 'bg-chart-2';
      default: return 'bg-muted';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'moderate': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <div className="text-center space-y-2">
            <p className="text-destructive text-sm">Failed to load activity</p>
            <Button size="sm" variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button size="sm" variant="ghost" onClick={() => refetch()} data-testid="button-refresh-activity">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 max-h-80 overflow-y-auto">
        {!activities || activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border"></div>
            
            {activities.map((activity: ActivityItem, index: number) => {
              const Icon = getActivityIcon(activity.type);
              const dotColor = getActivityColor(activity.severity);
              
              return (
                <div key={activity.id} className="relative flex items-start space-x-4 pb-6 last:pb-0">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-10 h-10 ${dotColor} rounded-full flex items-center justify-center border-2 border-card flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2" data-testid={`activity-title-${index}`}>
                        {activity.title}
                      </h4>
                      <Badge 
                        variant={getSeverityBadgeColor(activity.severity) as any}
                        className="ml-2 flex-shrink-0 text-xs"
                      >
                        {activity.severity}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span data-testid={`activity-timestamp-${index}`}>
                        {formatTimestamp(activity.timestamp)}
                      </span>
                      {activity.source && (
                        <span className="capitalize">{activity.source}</span>
                      )}
                      {activity.location && (
                        <span className="truncate">{activity.location}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      {activities && activities.length > 0 && (
        <div className="px-6 py-3 border-t border-border">
          <Button variant="outline" size="sm" className="w-full" data-testid="button-view-all-activity">
            View All Activity
          </Button>
        </div>
      )}
    </Card>
  );
}
