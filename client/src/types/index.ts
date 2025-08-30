// Re-export shared types
export type {
  User,
  UpsertUser,
  Incident,
  InsertIncident,
  CitizenReport,
  InsertCitizenReport,
  SocialMediaPost,
  InsertSocialMediaPost,
  Notification,
  InsertNotification,
  SystemStatus,
  Analytics,
} from '@shared/schema';

// Frontend-specific types
export interface DashboardStats {
  activeIncidents: number;
  todayReports: number;
  socialMentions: number;
  criticalIncidents: number;
  moderateIncidents: number;
}

export interface ActivityItem {
  id: string;
  type: 'incident' | 'report' | 'social';
  title: string;
  severity: string;
  timestamp: string;
  location?: string;
  source?: string;
}

export interface MapMarker {
  id: string;
  type: 'critical' | 'moderate' | 'normal';
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  timestamp: string;
  severity: string;
}

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: number;
  channel?: string;
  userId?: string;
  [key: string]: any;
}

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

export interface FileUpload {
  file: File;
  preview?: string;
  uploadProgress?: number;
  uploadError?: string;
  uploadUrl?: string;
}

export interface FilterOptions {
  hazardType?: string;
  severity?: string;
  status?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationInfo;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

// Form types
export interface QuickReportFormData {
  hazardType: string;
  severity: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  contactPhone?: string;
  contactEmail?: string;
  isAnonymous: boolean;
  files?: FileUpload[];
}

export interface EmergencyAlertData {
  title: string;
  message: string;
  severity: string;
  hazardType: string;
  location: string;
  affectedRadius: number;
  evacuationRequired: boolean;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Language types
export type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'ml' | 'kn' | 'gu';

// User preference types
export interface UserPreferences {
  theme: Theme;
  language: Language;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    emergency: boolean;
  };
  location: {
    shareLocation: boolean;
    defaultLocation?: string;
  };
}

// Navigation types
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current: boolean;
  badge?: number;
  adminOnly?: boolean;
}

// Dashboard layout types
export type DashboardLayout = 'grid' | 'list' | 'compact';

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  timestamp?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  category?: string;
}

// Social media types
export interface SocialMediaMetrics {
  platform: string;
  mentions: number;
  sentiment: 'positive' | 'negative' | 'neutral' | 'urgent';
  engagement: number;
  reach: number;
  trending_keywords: string[];
}

// Notification preferences
export interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'web';
  enabled: boolean;
  address?: string; // email or phone number
}

// System health types
export interface SystemHealth {
  status: 'operational' | 'degraded' | 'down';
  components: {
    api: ComponentStatus;
    database: ComponentStatus;
    websocket: ComponentStatus;
    social_monitor: ComponentStatus;
    gps_service: ComponentStatus;
  };
  lastCheck: string;
}

export interface ComponentStatus {
  status: 'operational' | 'degraded' | 'down';
  responseTime?: number;
  errorRate?: number;
  lastError?: string;
}

// Mobile-specific types
export interface TouchGesture {
  type: 'tap' | 'swipe' | 'pinch' | 'rotate';
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  scale?: number;
  rotation?: number;
}

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  supportsGeolocation: boolean;
  supportsCamera: boolean;
  connectionType?: string;
}

// Analytics types
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  properties?: Record<string, any>;
}

// Export utility types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
