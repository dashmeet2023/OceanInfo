import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Camera, 
  Video, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface IncidentReport {
  id: string;
  title?: string;
  description: string;
  hazardType: string;
  severity: string;
  location: string;
  latitude: number;
  longitude: number;
  isVerified: boolean;
  isAnonymous: boolean;
  mediaUrls: string[];
  contactPhone?: string;
  contactEmail?: string;
  createdAt: string;
  reporter?: {
    firstName?: string;
    lastName?: string;
  };
}

export default function IncidentReports() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reports, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/reports'],
    refetchInterval: 30000, // RefreshCw every 30 seconds
  });

  const verifyReportMutation = useMutation({
    mutationFn: async (reportId: string) => {
      await apiRequest('PUT', `/api/reports/${reportId}/verify`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
      toast({
        title: "Report Verified",
        description: "The incident report has been successfully verified.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Verification Failed",
        description: "Failed to verify the report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'moderate': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getHazardTypeIcon = (hazardType: string) => {
    // You could return different icons based on hazard type
    return AlertTriangle;
  };

  const formatHazardType = (hazardType: string) => {
    return hazardType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getReporterName = (report: IncidentReport) => {
    if (report.isAnonymous) return 'Anonymous Citizen';
    if (report.reporter?.firstName && report.reporter?.lastName) {
      return `${report.reporter.firstName} ${report.reporter.lastName}`;
    }
    return 'Citizen Observer';
  };

  const handleVerifyReport = (reportId: string) => {
    verifyReportMutation.mutate(reportId);
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Incident Reports</CardTitle>
            <Skeleton className="w-16 h-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Skeleton className="h-3 w-3 rounded" />
                  <Skeleton className="h-3 w-3 rounded" />
                  <Skeleton className="h-3 w-3 rounded" />
                </div>
                <Skeleton className="h-6 w-20" />
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
          <CardTitle>Recent Incident Reports</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <div className="text-center space-y-2">
            <p className="text-destructive text-sm">Failed to load incident reports</p>
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
          <CardTitle className="text-lg">Recent Incident Reports</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary hover:text-primary/80"
            data-testid="button-view-all-reports"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">View All</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-96 px-6">
          {!reports || reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No incident reports found</p>
              <p className="text-xs mt-1">Reports will appear here as they are submitted</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report: IncidentReport) => {
                const HazardIcon = getHazardTypeIcon(report.hazardType);
                
                return (
                  <div key={report.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge 
                            variant={getSeverityColor(report.severity) as any}
                            className="text-xs"
                          >
                            {report.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ID: #{report.id.slice(-8).toUpperCase()}
                          </span>
                          {report.isVerified && (
                            <Badge variant="outline" className="text-xs text-chart-2 border-chart-2">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-sm mb-1" data-testid={`report-title-${report.id}`}>
                          {report.title || formatHazardType(report.hazardType)} Report
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{getReporterName(report)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-24">{report.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 text-right flex-shrink-0">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-2">
                          <Clock className="w-3 h-3" />
                          <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {report.mediaUrls.some(url => url.includes('image') || url.includes('photo')) && (
                            <Camera className="w-3 h-3 text-muted-foreground" />
                          )}
                          {report.mediaUrls.some(url => url.includes('video')) && (
                            <Video className="w-3 h-3 text-muted-foreground" />
                          )}
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>
                          Status: <span className="text-foreground font-medium">
                            {report.isVerified ? 'Verified' : 'Under Review'}
                          </span>
                        </span>
                        <span>
                          Priority: <span className="text-foreground font-medium capitalize">
                            {report.severity}
                          </span>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!report.isVerified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyReport(report.id)}
                            disabled={verifyReportMutation.isPending}
                            className="text-xs h-7 px-2"
                            data-testid={`button-verify-${report.id}`}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verify
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7 px-2 text-primary hover:text-primary/80"
                          data-testid={`button-view-details-${report.id}`}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
