import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertCitizenReportSchema } from "@shared/schema";
import { z } from "zod";
import { 
  MapPin, 
  Upload, 
  AlertTriangle, 
  Camera, 
  Phone, 
  Mail, 
  Shield,
  Loader2,
  CheckCircle
} from "lucide-react";

const quickReportSchema = insertCitizenReportSchema.extend({
  hazardType: z.enum([
    "tsunami",
    "storm_surge", 
    "high_waves",
    "unusual_tides",
    "coastal_flooding",
    "swell_surge",
    "coastal_current",
    "other"
  ]),
  severity: z.enum(["critical", "high", "moderate", "low"]),
  description: z.string().min(10, "Please provide a detailed description (minimum 10 characters)"),
  location: z.string().min(3, "Please provide a location"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  reporterId: true,
  incidentId: true,
  verifiedBy: true,
  mediaUrls: true,
  metadata: true,
});

type QuickReportFormData = z.infer<typeof quickReportSchema>;

const hazardTypeOptions = [
  { value: "tsunami", label: "Tsunami" },
  { value: "storm_surge", label: "Storm Surge" },
  { value: "high_waves", label: "High Waves" },
  { value: "unusual_tides", label: "Unusual Tides" },
  { value: "coastal_flooding", label: "Coastal Flooding" },
  { value: "swell_surge", label: "Swell Surge" },
  { value: "coastal_current", label: "Coastal Current" },
  { value: "other", label: "Other" },
];

const severityOptions = [
  { value: "critical", label: "Critical", color: "destructive" },
  { value: "high", label: "High", color: "default" },
  { value: "moderate", label: "Moderate", color: "secondary" },
  { value: "low", label: "Low", color: "outline" },
];

export default function QuickReportForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { location, isLoading: locationLoading, getCurrentLocation } = useGeolocation();

  const form = useForm<QuickReportFormData>({
    resolver: zodResolver(quickReportSchema),
    defaultValues: {
      hazardType: undefined,
      severity: undefined,
      description: "",
      location: "",
      latitude: 0,
      longitude: 0,
      contactPhone: "",
      contactEmail: "",
      isAnonymous: true,
      isVerified: false,
    },
  });

  const submitReportMutation = useMutation({
    mutationFn: async (data: QuickReportFormData) => {
      // First submit the report
      const response = await apiRequest('POST', '/api/reports', {
        ...data,
        isEmergency,
        mediaUrls: [], // TODO: Implement file upload
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity'] });
      
      toast({
        title: isEmergency ? "🚨 Emergency Alert Sent!" : "✓ Report Submitted",
        description: isEmergency 
          ? "Emergency services have been notified immediately."
          : "Your report has been submitted and is being reviewed.",
        variant: isEmergency ? "destructive" : "default",
      });
      
      // Reset form
      form.reset();
      setFiles([]);
      setIsEmergency(false);
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
        title: "Submission Failed",
        description: "Failed to submit your report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUseGPS = async () => {
    try {
      const position = await getCurrentLocation();
      if (position) {
        form.setValue('latitude', position.latitude);
        form.setValue('longitude', position.longitude);
        form.setValue('location', `${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`);
        toast({
          title: "Location Updated",
          description: "GPS coordinates have been captured successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "GPS Error",
        description: "Unable to get location. Please enter manually.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (validFiles.length !== selectedFiles.length) {
      toast({
        title: "Invalid Files",
        description: "Only image and video files are allowed.",
        variant: "destructive",
      });
    }
    
    setFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: QuickReportFormData) => {
    submitReportMutation.mutate(data);
  };

  const handleEmergencyAlert = () => {
    setIsEmergency(true);
    form.setValue('severity', 'critical');
    // Auto-submit if form is valid
    form.handleSubmit(onSubmit)();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Quick Incident Report</CardTitle>
        <p className="text-sm text-muted-foreground">
          Report ocean hazards you observe in real-time
        </p>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Hazard Type and Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hazardType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hazard Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-hazard-type">
                          <SelectValue placeholder="Select hazard type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hazardTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity Level *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-severity">
                          <SelectValue placeholder="Select severity..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {severityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-2">
                              <Badge variant={option.color as any} className="text-xs">
                                {option.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input
                        placeholder="Enter location or use GPS"
                        {...field}
                        data-testid="input-location"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUseGPS}
                      disabled={locationLoading}
                      data-testid="button-use-gps"
                    >
                      {locationLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you're observing..."
                      rows={3}
                      {...field}
                      data-testid="textarea-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Media Upload and Contact Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Media Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">Photo/Video</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-accent/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    data-testid="input-file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag files here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Images and videos only (max 5 files)
                    </p>
                  </label>
                </div>
                
                {/* File Preview */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                        <div className="flex items-center space-x-2">
                          {file.type.startsWith('image/') ? (
                            <Camera className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Upload className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="truncate">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Contact Information */}
              <div className="space-y-4">
                <label className="block text-sm font-medium">Contact Information (Optional)</label>
                
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Phone number"
                            className="pl-10"
                            {...field}
                            data-testid="input-contact-phone"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Email address"
                            type="email"
                            className="pl-10"
                            {...field}
                            data-testid="input-contact-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-4">
                  <Shield className="w-4 h-4" />
                  <span>Reports are anonymous by default</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={submitReportMutation.isPending}
                className="w-full sm:w-auto"
                data-testid="button-submit-report"
              >
                {submitReportMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="destructive"
                onClick={handleEmergencyAlert}
                disabled={submitReportMutation.isPending}
                className="w-full sm:w-auto"
                data-testid="button-emergency-alert"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency Alert
              </Button>
              
              <div className="flex-1" />
              
              <p className="text-xs text-muted-foreground text-center sm:text-right">
                Emergency reports are sent immediately to response teams
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
