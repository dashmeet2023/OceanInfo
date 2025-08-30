import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, TrendingUp, RefreshCw, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SocialPost {
  id: string;
  platform: string;
  username: string;
  content: string;
  sentiment: string;
  hazardType?: string;
  severity?: string;
  confidence: number;
  location?: string;
  originalPostDate: string;
  engagement: {
    likes?: number;
    shares?: number;
    comments?: number;
  };
}

export default function SocialMonitor() {
  const { data: socialPosts, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/social'],
    refetchInterval: 60000, // RefreshCw every minute
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'urgent': return 'border-destructive';
      case 'concerned': return 'border-chart-3';
      case 'positive': return 'border-chart-2';
      case 'neutral': return 'border-muted';
      default: return 'border-muted';
    }
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    
    const variants = {
      critical: 'destructive',
      high: 'default',
      moderate: 'secondary',
      low: 'outline',
    } as const;
    
    return (
      <Badge variant={variants[severity as keyof typeof variants] || 'outline'} className="text-xs">
        {severity}
      </Badge>
    );
  };

  const getPlatformIcon = (platform: string) => {
    // Platform-specific styling could be added here
    return platform.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Social Media Monitor</CardTitle>
            <div className="flex items-center space-x-2">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-2 h-2 rounded-full" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="flex space-x-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
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
          <CardTitle>Social Media Monitor</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <div className="text-center space-y-2">
            <p className="text-destructive text-sm">Failed to load social media data</p>
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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Social Media Monitor</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground hidden sm:block">Auto-refresh</span>
            <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse"></div>
            <Button size="sm" variant="ghost" onClick={() => refetch()} data-testid="button-refresh-social">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-96 px-6">
          {!socialPosts || socialPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No social media activity detected</p>
              <p className="text-xs mt-1">AI monitoring is active</p>
            </div>
          ) : (
            <div className="space-y-4">
              {socialPosts.map((post: SocialPost) => (
                <div 
                  key={post.id} 
                  className={`border-l-4 ${getSentimentColor(post.sentiment)} pl-4 pb-4 border-b border-border last:border-b-0`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-relaxed line-clamp-3" data-testid={`social-post-content-${post.id}`}>
                        "{post.content}"
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {getSeverityBadge(post.severity)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-xs">
                        {getPlatformIcon(post.platform)}
                      </div>
                      <span className="font-medium">@{post.username}</span>
                    </div>
                    <span className="capitalize">{post.platform}</span>
                    <span>{formatDistanceToNow(new Date(post.originalPostDate), { addSuffix: true })}</span>
                    {post.location && (
                      <span className="text-primary">{post.location}</span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-4">
                      <span className="text-muted-foreground">
                        Sentiment: <span className={`font-medium ${
                          post.sentiment === 'urgent' ? 'text-destructive' :
                          post.sentiment === 'concerned' ? 'text-chart-3' :
                          post.sentiment === 'positive' ? 'text-chart-2' :
                          'text-muted-foreground'
                        }`}>
                          {post.sentiment}
                        </span>
                      </span>
                      {post.hazardType && (
                        <span className="text-muted-foreground">
                          Type: <span className="text-foreground capitalize">{post.hazardType.replace('_', ' ')}</span>
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        Confidence: <span className="text-foreground">{Math.round(post.confidence * 100)}%</span>
                      </span>
                    </div>
                    
                    {/* Engagement metrics */}
                    {post.engagement && Object.keys(post.engagement).length > 0 && (
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        {post.engagement.likes && (
                          <span className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>{post.engagement.likes}</span>
                          </span>
                        )}
                        {post.engagement.shares && (
                          <span>{post.engagement.shares} shares</span>
                        )}
                        {post.engagement.comments && (
                          <span>{post.engagement.comments} comments</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      
      {socialPosts && socialPosts.length > 0 && (
        <div className="px-6 py-3 border-t border-border flex-shrink-0">
          <Button variant="outline" size="sm" className="w-full" data-testid="button-view-all-social">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Detailed Analysis
          </Button>
        </div>
      )}
    </Card>
  );
}
