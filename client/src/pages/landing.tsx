import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Waves, 
  Shield, 
  Users, 
  BarChart3, 
  MapPin, 
  Bell, 
  Smartphone, 
  Globe,
  Zap,
  Eye
} from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Waves className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">INCOIS</span>
            <Badge variant="secondary" className="ml-2">Ocean Monitoring</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-chart-2 rounded-full animate-pulse"></div>
              <span>Live Monitoring Active</span>
            </div>
            <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90">
              Login to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 lg:px-6 bg-gradient-to-br from-background via-accent/5 to-primary/5">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Real-Time Ocean
              <span className="block text-primary">Hazard Monitoring</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Advanced early warning system for tsunamis, storm surges, and coastal hazards. 
              Protecting India's coastline with precision monitoring and community reporting.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            >
              <Shield className="w-5 h-5 mr-2" />
              Access Emergency Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Eye className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
          
          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="border-primary/20">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-primary" data-testid="stat-monitoring-points">47</div>
                <div className="text-sm text-muted-foreground">Monitoring Points</div>
              </CardContent>
            </Card>
            <Card className="border-chart-2/20">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-chart-2" data-testid="stat-active-users">12.5K</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
            <Card className="border-chart-3/20">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-chart-3" data-testid="stat-reports-processed">2.8M</div>
                <div className="text-sm text-muted-foreground">Reports Processed</div>
              </CardContent>
            </Card>
            <Card className="border-chart-4/20">
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-chart-4" data-testid="stat-alerts-sent">89K</div>
                <div className="text-sm text-muted-foreground">Alerts Sent</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 lg:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Ocean Safety Platform</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combining satellite data, citizen reports, and AI-powered social media monitoring 
              for unprecedented coastal hazard awareness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real-time Monitoring */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Real-Time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Continuous monitoring of ocean conditions with satellite data, 
                  sensors, and numerical models for instant hazard detection.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">Tsunami Detection</Badge>
                  <Badge variant="secondary">Wave Height</Badge>
                  <Badge variant="secondary">Storm Surge</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Citizen Reporting */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-chart-2/10 hover:border-chart-2/30">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-2/20 transition-colors">
                  <Users className="w-6 h-6 text-chart-2" />
                </div>
                <CardTitle>Community Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Crowdsourced reports from coastal residents with GPS tracking, 
                  photo/video uploads, and immediate verification systems.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">GPS Tracking</Badge>
                  <Badge variant="secondary">Media Upload</Badge>
                  <Badge variant="secondary">Verification</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Social Media AI */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-chart-3/10 hover:border-chart-3/30">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-3/20 transition-colors">
                  <BarChart3 className="w-6 h-6 text-chart-3" />
                </div>
                <CardTitle>AI Social Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Natural language processing of social media posts to detect 
                  hazard discussions and public sentiment trends.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">NLP Processing</Badge>
                  <Badge variant="secondary">Sentiment Analysis</Badge>
                  <Badge variant="secondary">Trend Detection</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Mapping */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-chart-4/10 hover:border-chart-4/30">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-4/20 transition-colors">
                  <MapPin className="w-6 h-6 text-chart-4" />
                </div>
                <CardTitle>Dynamic Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Interactive maps with real-time hotspot generation based on 
                  report density and verified threat indicators.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">Hotspot Generation</Badge>
                  <Badge variant="secondary">Layer Filtering</Badge>
                  <Badge variant="secondary">Real-time Updates</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Alerts */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-chart-5/10 hover:border-chart-5/30">
              <CardHeader>
                <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-5/20 transition-colors">
                  <Bell className="w-6 h-6 text-chart-5" />
                </div>
                <CardTitle>Emergency Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Multi-channel alert system with SMS, email, push notifications, 
                  and automated escalation based on severity levels.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">Multi-channel</Badge>
                  <Badge variant="secondary">Auto-escalation</Badge>
                  <Badge variant="secondary">Geo-targeting</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Mobile & Offline */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-muted/20 hover:border-muted/40">
              <CardHeader>
                <div className="w-12 h-12 bg-muted/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-muted/20 transition-colors">
                  <Smartphone className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardTitle>Mobile & Offline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Responsive mobile interface with offline data collection 
                  capabilities for remote coastal areas with limited connectivity.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">Offline Sync</Badge>
                  <Badge variant="secondary">PWA Support</Badge>
                  <Badge variant="secondary">Mobile Optimized</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Multi-language Support */}
      <section className="py-16 px-4 lg:px-6 bg-accent/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Multi-Language Support</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Available in multiple Indian languages to ensure effective communication 
            across diverse coastal communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">English</Badge>
            <Badge variant="outline" className="px-4 py-2">हिंदी (Hindi)</Badge>
            <Badge variant="outline" className="px-4 py-2">বাংলা (Bengali)</Badge>
            <Badge variant="outline" className="px-4 py-2">தமிழ் (Tamil)</Badge>
            <Badge variant="outline" className="px-4 py-2">తెలుగు (Telugu)</Badge>
            <Badge variant="outline" className="px-4 py-2">മലയാളം (Malayalam)</Badge>
            <Badge variant="outline" className="px-4 py-2">ಕನ್ನಡ (Kannada)</Badge>
            <Badge variant="outline" className="px-4 py-2">ગુજરાતી (Gujarati)</Badge>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-6 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join India's Ocean Safety Network
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of the community protecting India's 7,516 km coastline. 
            Your reports can save lives and help emergency responders act faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              data-testid="button-join-network"
            >
              <Users className="w-5 h-5 mr-2" />
              Join the Network
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
              data-testid="button-emergency-report"
            >
              <Bell className="w-5 h-5 mr-2" />
              Report Emergency
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 py-12 px-4 lg:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Waves className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">INCOIS</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Indian National Centre for Ocean Information Services - 
                Providing ocean information and advisory services for maritime safety 
                and disaster risk reduction.
              </p>
              <p className="text-sm text-muted-foreground">
                Ministry of Earth Sciences, Government of India
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={handleLogin} className="hover:text-primary transition-colors">Dashboard</button></li>
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="/api/login" className="hover:text-primary transition-colors">Login</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Emergency</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={handleLogin} className="hover:text-destructive transition-colors">Report Hazard</button></li>
                <li><button onClick={handleLogin} className="hover:text-destructive transition-colors">Emergency Alerts</button></li>
                <li><a href="tel:1077" className="hover:text-destructive transition-colors">Call 1077</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Indian National Centre for Ocean Information Services. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
