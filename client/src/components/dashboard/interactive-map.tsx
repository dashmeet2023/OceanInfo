import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, MapPin, Layers } from "lucide-react";
import { useState, useEffect } from "react";

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'critical' | 'moderate' | 'normal';
  title: string;
  description: string;
}

export default function InteractiveMap() {
  const [selectedLayer, setSelectedLayer] = useState<'realtime' | 'historical'>('realtime');
  const [zoomLevel, setZoomLevel] = useState(6);
  const [markers, setMarkers] = useState<MapMarker[]>([
    {
      id: '1',
      lat: 19.0760,
      lng: 72.8777,
      type: 'critical',
      title: 'High waves flooding coastal road',
      description: 'Mumbai Marine Drive experiencing severe wave activity'
    },
    {
      id: '2',
      lat: 13.0827,
      lng: 80.2707,
      type: 'moderate',
      title: 'Unusual current patterns',
      description: 'Chennai fishing areas reporting strong currents'
    },
    {
      id: '3',
      lat: 15.2993,
      lng: 74.1240,
      type: 'normal',
      title: 'Normal conditions',
      description: 'Goa beaches reporting calm seas'
    },
  ]);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-destructive border-white';
      case 'moderate': return 'bg-chart-3 border-white';
      case 'normal': return 'bg-chart-2 border-white';
      default: return 'bg-muted border-white';
    }
  };

  const getMarkerSize = (type: string) => {
    switch (type) {
      case 'critical': return 'w-4 h-4';
      case 'moderate': return 'w-3 h-3';
      case 'normal': return 'w-3 h-3';
      default: return 'w-2 h-2';
    }
  };

  const getMarkerAnimation = (type: string) => {
    return type === 'critical' ? 'animate-pulse' : '';
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 12));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 2));
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Live Hazard Map</CardTitle>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={selectedLayer === 'realtime' ? 'default' : 'outline'}
              onClick={() => setSelectedLayer('realtime')}
              data-testid="button-realtime-layer"
            >
              Real-time
            </Button>
            <Button
              size="sm"
              variant={selectedLayer === 'historical' ? 'default' : 'outline'}
              onClick={() => setSelectedLayer('historical')}
              data-testid="button-historical-layer"
            >
              Historical
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative h-80 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 overflow-hidden">
          {/* Map Background - Simulated Indian Ocean coastline */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,0 L1000,0 L1000,400 L0,400 Z' fill='%234f87c4'/%3E%3Cpath d='M0,250 Q100,240 200,250 T400,260 T600,250 T800,240 T1000,250 L1000,400 L0,400 Z' fill='%2365a3d9'/%3E%3Cpath d='M0,280 Q150,270 300,280 T600,290 T900,280 L1000,280 L1000,400 L0,400 Z' fill='%237bb3e0'/%3E%3C/svg%3E")`
            }}
          />
          
          {/* Coastline overlay */}
          <div className="absolute inset-0">
            <svg viewBox="0 0 1000 400" className="w-full h-full">
              <path 
                d="M0,320 Q200,310 400,320 T800,315 L1000,320 L1000,400 L0,400 Z" 
                fill="#8B7355" 
                opacity="0.6"
              />
              <path 
                d="M0,340 Q250,330 500,340 T1000,345 L1000,400 L0,400 Z" 
                fill="#A0916B" 
                opacity="0.4"
              />
            </svg>
          </div>
          
          {/* Map Markers */}
          {markers.map((marker) => {
            // Convert lat/lng to pixel positions (simplified)
            const x = ((marker.lng - 68) / (97 - 68)) * 100; // India longitude range approx
            const y = ((28 - marker.lat) / (28 - 8)) * 80 + 10; // India latitude range approx
            
            return (
              <div
                key={marker.id}
                className={`absolute ${getMarkerSize(marker.type)} ${getMarkerColor(marker.type)} ${getMarkerAnimation(marker.type)} rounded-full border-2 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform`}
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`
                }}
                title={marker.title}
                data-testid={`map-marker-${marker.type}`}
              />
            );
          })}
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 bg-card rounded-lg p-2 space-y-2 shadow-lg">
            <Button 
              size="sm" 
              variant="outline" 
              className="w-8 h-8 p-0"
              onClick={handleZoomIn}
              data-testid="button-zoom-in"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-8 h-8 p-0"
              onClick={handleZoomOut}
              data-testid="button-zoom-out"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Current zoom indicator */}
          <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
            Zoom: {zoomLevel}x
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
            <h4 className="text-xs font-semibold mb-2">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                <span>Critical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
                <span>Moderate</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                <span>Normal</span>
              </div>
            </div>
          </div>
          
          {/* Location Info Panel */}
          <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 min-w-48">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">India Coastline</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Active Monitoring: 47 Points</div>
              <div>Coverage: 7,516 km coastline</div>
              <div>Last Update: 2 min ago</div>
            </div>
          </div>
        </div>
        
        {/* Map Footer */}
        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Real-time data from INCOIS monitoring network</span>
            <div className="flex items-center space-x-2">
              <Layers className="w-3 h-3" />
              <span>Layer: {selectedLayer}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
