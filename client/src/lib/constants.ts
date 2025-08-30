// API Configuration
export const API_BASE_URL = '/api';
export const WS_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`
  : '';

// Hazard Types
export const HAZARD_TYPES = {
  TSUNAMI: 'tsunami',
  STORM_SURGE: 'storm_surge',
  HIGH_WAVES: 'high_waves',
  UNUSUAL_TIDES: 'unusual_tides',
  COASTAL_FLOODING: 'coastal_flooding',
  SWELL_SURGE: 'swell_surge',
  COASTAL_CURRENT: 'coastal_current',
  OTHER: 'other',
} as const;

export const HAZARD_TYPE_LABELS = {
  [HAZARD_TYPES.TSUNAMI]: 'Tsunami',
  [HAZARD_TYPES.STORM_SURGE]: 'Storm Surge',
  [HAZARD_TYPES.HIGH_WAVES]: 'High Waves',
  [HAZARD_TYPES.UNUSUAL_TIDES]: 'Unusual Tides',
  [HAZARD_TYPES.COASTAL_FLOODING]: 'Coastal Flooding',
  [HAZARD_TYPES.SWELL_SURGE]: 'Swell Surge',
  [HAZARD_TYPES.COASTAL_CURRENT]: 'Coastal Current',
  [HAZARD_TYPES.OTHER]: 'Other',
} as const;

// Severity Levels
export const SEVERITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MODERATE: 'moderate',
  LOW: 'low',
} as const;

export const SEVERITY_COLORS = {
  [SEVERITY_LEVELS.CRITICAL]: 'destructive',
  [SEVERITY_LEVELS.HIGH]: 'default',
  [SEVERITY_LEVELS.MODERATE]: 'secondary',
  [SEVERITY_LEVELS.LOW]: 'outline',
} as const;

// Incident Status
export const INCIDENT_STATUS = {
  REPORTED: 'reported',
  INVESTIGATING: 'investigating',
  VERIFIED: 'verified',
  RESOLVED: 'resolved',
  FALSE_ALARM: 'false_alarm',
} as const;

// Social Media Platforms
export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  EMERGENCY_ALERT: 'emergency_alert',
  INCIDENT_UPDATE: 'incident_update',
  SOCIAL_MEDIA_SPIKE: 'social_media_spike',
  WELCOME: 'welcome',
  REPORT_VERIFIED: 'report_verified',
} as const;

// User Roles
export const USER_ROLES = {
  CITIZEN: 'citizen',
  OFFICIAL: 'official',
  ANALYST: 'analyst',
  ADMIN: 'admin',
  EMERGENCY_MANAGER: 'emergency_manager',
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 20.5937, lng: 78.9629 }, // India center
  DEFAULT_ZOOM: 6,
  MIN_ZOOM: 2,
  MAX_ZOOM: 18,
  MARKER_CLUSTER_MAX_ZOOM: 12,
} as const;

// Geolocation Configuration
export const GEOLOCATION_CONFIG = {
  ENABLE_HIGH_ACCURACY: true,
  TIMEOUT: 10000, // 10 seconds
  MAXIMUM_AGE: 60000, // 1 minute
  WATCH_TIMEOUT: 15000, // 15 seconds for continuous watching
  WATCH_MAXIMUM_AGE: 30000, // 30 seconds for continuous watching
} as const;

// File Upload Configuration
export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 5,
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ACCEPTED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
} as const;

// WebSocket Configuration
export const WEBSOCKET_CONFIG = {
  RECONNECT_ATTEMPTS: 5,
  INITIAL_RECONNECT_DELAY: 1000, // 1 second
  MAX_RECONNECT_DELAY: 30000, // 30 seconds
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
} as const;

// Query Configuration
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  REFETCH_INTERVAL: {
    DASHBOARD: 30000, // 30 seconds
    ACTIVITY: 30000, // 30 seconds
    SOCIAL: 60000, // 1 minute
    REPORTS: 30000, // 30 seconds
  },
} as const;

// Responsive Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  STORAGE_KEY: 'incois-theme',
} as const;

// Language Configuration
export const SUPPORTED_LANGUAGES = {
  EN: 'en',
  HI: 'hi', // Hindi
  BN: 'bn', // Bengali
  TA: 'ta', // Tamil
  TE: 'te', // Telugu
  ML: 'ml', // Malayalam
  KN: 'kn', // Kannada
  GU: 'gu', // Gujarati
} as const;

export const LANGUAGE_LABELS = {
  [SUPPORTED_LANGUAGES.EN]: 'English',
  [SUPPORTED_LANGUAGES.HI]: 'हिंदी',
  [SUPPORTED_LANGUAGES.BN]: 'বাংলা',
  [SUPPORTED_LANGUAGES.TA]: 'தமிழ்',
  [SUPPORTED_LANGUAGES.TE]: 'తెలుగు',
  [SUPPORTED_LANGUAGES.ML]: 'മലയാളം',
  [SUPPORTED_LANGUAGES.KN]: 'ಕನ್ನಡ',
  [SUPPORTED_LANGUAGES.GU]: 'ગુજરાતી',
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_LOCATION_LENGTH: 3,
  MAX_LOCATION_LENGTH: 100,
  PHONE_PATTERN: /^[+]?[\d\s\-\(\)]{7,15}$/,
  COORDINATE_PRECISION: 6,
} as const;

// Emergency Contact Information
export const EMERGENCY_CONTACTS = {
  NATIONAL_DISASTER_HELPLINE: '1077',
  POLICE: '100',
  FIRE: '101',
  AMBULANCE: '102',
  COAST_GUARD: '1554',
} as const;

// Toast Configuration
export const TOAST_CONFIG = {
  DEFAULT_DURATION: 5000, // 5 seconds
  ERROR_DURATION: 7000, // 7 seconds
  SUCCESS_DURATION: 4000, // 4 seconds
  WARNING_DURATION: 6000, // 6 seconds
} as const;
