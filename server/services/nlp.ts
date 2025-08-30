// Natural Language Processing service for social media analysis
export class NLPService {
  // Hazard-related keywords for different categories
  private static readonly HAZARD_KEYWORDS = {
    tsunami: ['tsunami', 'tidal wave', 'giant wave', 'seismic wave', 'massive wave'],
    storm_surge: ['storm surge', 'surge', 'cyclone surge', 'hurricane surge', 'coastal flooding'],
    high_waves: ['high waves', 'big waves', 'huge waves', 'rough seas', 'choppy waters'],
    unusual_tides: ['unusual tide', 'abnormal tide', 'strange tide', 'weird tide'],
    coastal_flooding: ['coastal flood', 'beach flood', 'shore flood', 'waterlogging'],
    swell_surge: ['swell surge', 'ground swell', 'ocean swell'],
    coastal_current: ['strong current', 'dangerous current', 'rip current', 'undertow'],
  };

  private static readonly SEVERITY_KEYWORDS = {
    critical: ['emergency', 'urgent', 'critical', 'dangerous', 'life-threatening', 'evacuation'],
    high: ['severe', 'serious', 'major', 'significant', 'warning'],
    moderate: ['moderate', 'noticeable', 'concerning', 'unusual'],
    low: ['minor', 'slight', 'small', 'normal'],
  };

  private static readonly SENTIMENT_KEYWORDS = {
    urgent: ['help', 'emergency', 'urgent', 'now', 'immediately', 'rescue'],
    concerned: ['worried', 'scared', 'concerned', 'anxious', 'afraid'],
    neutral: ['observed', 'noticed', 'seen', 'happening'],
    positive: ['safe', 'calm', 'beautiful', 'peaceful', 'clear'],
  };

  private static readonly LOCATION_KEYWORDS = {
    // Major Indian coastal cities and regions
    mumbai: ['mumbai', 'bombay', 'marine drive', 'juhu', 'versova'],
    chennai: ['chennai', 'madras', 'marina beach', 'besant nagar'],
    kolkata: ['kolkata', 'calcutta', 'howrah', 'diamond harbour'],
    kochi: ['kochi', 'cochin', 'ernakulam', 'fort kochi'],
    visakhapatnam: ['visakhapatnam', 'vizag', 'vishakhapatnam'],
    goa: ['goa', 'panaji', 'margao', 'calangute', 'baga'],
    // Add more locations as needed
  };

  /**
   * Analyze social media post content for hazard relevance
   */
  static analyzeSocialMediaPost(content: string): {
    isRelevant: boolean;
    hazardType?: string;
    severity?: string;
    sentiment?: string;
    confidence: number;
    location?: string;
    keywords: string[];
  } {
    const lowerContent = content.toLowerCase();
    const detectedKeywords: string[] = [];
    let hazardType: string | undefined;
    let severity: string | undefined;
    let sentiment: string | undefined;
    let location: string | undefined;
    let confidence = 0;

    // Check for hazard types
    for (const [type, keywords] of Object.entries(this.HAZARD_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerContent.includes(keyword)) {
          hazardType = type;
          detectedKeywords.push(keyword);
          confidence += 0.3;
          break;
        }
      }
      if (hazardType) break;
    }

    // Check for severity indicators
    for (const [level, keywords] of Object.entries(this.SEVERITY_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerContent.includes(keyword)) {
          severity = level;
          detectedKeywords.push(keyword);
          confidence += 0.2;
          break;
        }
      }
      if (severity) break;
    }

    // Check for sentiment
    for (const [sentimentType, keywords] of Object.entries(this.SENTIMENT_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerContent.includes(keyword)) {
          sentiment = sentimentType;
          detectedKeywords.push(keyword);
          confidence += 0.1;
          break;
        }
      }
      if (sentiment) break;
    }

    // Check for location
    for (const [locationName, keywords] of Object.entries(this.LOCATION_KEYWORDS)) {
      for (const keyword of keywords) {
        if (lowerContent.includes(keyword)) {
          location = locationName;
          detectedKeywords.push(keyword);
          confidence += 0.2;
          break;
        }
      }
      if (location) break;
    }

    // Additional relevance checks
    const oceanKeywords = ['ocean', 'sea', 'beach', 'coast', 'shore', 'wave', 'water', 'tide'];
    const hasOceanContext = oceanKeywords.some(keyword => lowerContent.includes(keyword));
    if (hasOceanContext) {
      confidence += 0.2;
    }

    // Hashtag analysis
    const hashtags = content.match(/#\w+/g) || [];
    const relevantHashtags = hashtags.filter(tag => 
      tag.toLowerCase().includes('tsunami') ||
      tag.toLowerCase().includes('flood') ||
      tag.toLowerCase().includes('wave') ||
      tag.toLowerCase().includes('storm')
    );
    if (relevantHashtags.length > 0) {
      confidence += 0.1 * relevantHashtags.length;
      detectedKeywords.push(...relevantHashtags);
    }

    // Ensure confidence doesn't exceed 1.0
    confidence = Math.min(confidence, 1.0);

    const isRelevant = confidence >= 0.3 && (hazardType || hasOceanContext);

    return {
      isRelevant,
      hazardType,
      severity: severity || 'low',
      sentiment: sentiment || 'neutral',
      confidence: Math.round(confidence * 100) / 100,
      location,
      keywords: detectedKeywords,
    };
  }

  /**
   * Extract location coordinates from text (placeholder)
   * In a real implementation, this would use geocoding services
   */
  static extractCoordinates(text: string, location?: string): {
    latitude?: number;
    longitude?: number;
  } {
    // Placeholder coordinates for major Indian coastal cities
    const coordinateMap: Record<string, { latitude: number; longitude: number }> = {
      mumbai: { latitude: 19.0760, longitude: 72.8777 },
      chennai: { latitude: 13.0827, longitude: 80.2707 },
      kolkata: { latitude: 22.5726, longitude: 88.3639 },
      kochi: { latitude: 9.9312, longitude: 76.2673 },
      visakhapatnam: { latitude: 17.6868, longitude: 83.2185 },
      goa: { latitude: 15.2993, longitude: 74.1240 },
    };

    if (location && coordinateMap[location]) {
      return coordinateMap[location];
    }

    // TODO: Implement proper geocoding API integration
    // e.g., Google Geocoding API, Mapbox Geocoding API
    return {};
  }

  /**
   * Calculate engagement score for social media posts
   */
  static calculateEngagementScore(engagement: any): number {
    const likes = engagement.likes || 0;
    const shares = engagement.shares || 0;
    const comments = engagement.comments || 0;
    const retweets = engagement.retweets || 0;

    // Weighted engagement score
    return (likes * 1) + (shares * 3) + (comments * 2) + (retweets * 2);
  }

  /**
   * Determine if content requires immediate attention
   */
  static requiresImmediateAttention(analysis: any): boolean {
    return (
      analysis.severity === 'critical' ||
      analysis.sentiment === 'urgent' ||
      (analysis.confidence >= 0.8 && analysis.hazardType === 'tsunami')
    );
  }
}
