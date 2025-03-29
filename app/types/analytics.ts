import { Timestamp } from 'firebase/firestore';

export interface VisitMetadata {
  device: string;
  os: string;
  browser: string;
  screenSize: string;
  location: {
    country: string;
    city: string;
    region: string;
  };
  demographics?: Demographics;
}

export interface VisitEntry {
  timestamp: Timestamp;
  type: 'view' | 'click' | 'scroll' | 'form_submit';
  metadata: VisitMetadata;
}

export interface AnalyticsData {
  views: number;
  uniqueVisitors: number;
  conversions: number;
  lastVisit: Timestamp;
  analytics: {
    visitHistory: VisitEntry[];
    demographics: Demographics;
    devices: Record<string, number>;
    operatingSystems: Record<string, number>;
    locations: {
      cities: Record<string, number>;
      countries: Record<string, number>;
    };
  };
}

export interface FirestoreAnalyticsData {
  views: number;
  uniqueVisitors: number;
  conversions: number;
  lastVisit: Timestamp;
  userId: string;
  slug: string;
  'analytics.visitHistory': VisitEntry[];
  'analytics.demographics': {
    ageGroups: Record<string, number>;
    gender: Record<string, number>;
    interests: Record<string, number>;
  };
  'analytics.devices': Record<string, number>;
  'analytics.operatingSystems': Record<string, number>;
  'analytics.locations': {
    cities: Record<string, number>;
    countries: Record<string, number>;
  };
}

export interface VisitHistory {
  timestamp: Timestamp;
  type: 'view' | 'conversion';
  metadata: {
    device: string;
    os: string;
    browser: string;
    screenSize: string;
    location: {
      country: string;
      city: string;
      region: string;
    };
  };
}

export interface Demographics {
  ageGroups: Record<string, number>;
  gender: Record<string, number>;
  interests: Record<string, number>;
  education: Record<string, number>;
  occupation: Record<string, number>;
  income: Record<string, number>;
  maritalStatus: Record<string, number>;
}

export interface Location {
  country: string;
  city: string;
  region: string;
  lat: number;
  lon: number;
}

export interface DeviceStats {
  desktop: number;
  mobile: number;
  tablet: number;
  other: number;
}

export interface LocationStats {
  countries: {
    [key: string]: number; // e.g. "ID": 100
  };
  cities: {
    [key: string]: number; // e.g. "Jakarta": 50
  };
}

export interface OSStats {
  windows: number;
  macos: number;
  linux: number;
  android: number;
  ios: number;
  other: number;
} 