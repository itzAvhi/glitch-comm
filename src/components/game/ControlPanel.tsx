import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface SystemStatus {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  switchState: boolean;
  powerLevel?: number;
  temperature?: number;
}

interface ControlPanelProps {
  onSystemChange: (systemId: string, newState: boolean) => void;
  onPowerLevelChange?: (systemId: string, level: number) => void;
  systemsStatus: SystemStatus[];
}

export const ControlPanel = ({ onSystemChange, onPowerLevelChange, systemsStatus }: ControlPanelProps) => {
  const [emergencyBlink, setEmergencyBlink] = useState(false);
  const [activeCircuit, setActiveCircuit] = useState<string | null>(null);
  const [sparkEffects, setSparkEffects] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setEmergencyBlink(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Add spark effects when systems change
    const interval = setInterval(() => {
      const newSparks: {[key: string]: boolean} = {};
      systemsStatus.forEach(system => {
        if (system.status === 'warning' && Math.random() < 0.3) {
          newSparks[system.id] = true;
        }
      });
      setSparkEffects(newSparks);
      
      setTimeout(() => setSparkEffects({}), 500);
    }, 2000);
    return () => clearInterval(interval);
  }, [systemsStatus]);

  const handleSwitchToggle = (systemId: string, currentState: boolean) => {
    onSystemChange(systemId, !currentState);
  };

  const handlePowerChange = (systemId: string, value: number[]) => {
    onPowerLevelChange?.(systemId, value[0]);
  };

  const handleCircuitClick = (systemId: string) => {
    setActiveCircuit(activeCircuit === systemId ? null : systemId);
  };

  return (
    <div className="space-y-6">
      <Card className="control-panel">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">CONTROL PANEL</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${emergencyBlink ? 'bg-emergency' : 'bg-emergency/50'}`}></div>
            <span className="text-emergency text-sm font-bold">EMERGENCY MODE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {systemsStatus.map((system) => (
            <div key={system.id} className="space-y-4 p-4 bg-card/50 rounded-lg border border-primary/20 relative overflow-hidden">
              {/* Spark effects */}
              {sparkEffects[system.id] && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-2 right-2 w-2 h-2 bg-warning animate-ping rounded-full"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-terminal animate-pulse rounded-full"></div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="font-medium text-primary">{system.name}</span>
                <div className={`status-indicator ${system.status} ${sparkEffects[system.id] ? 'animate-pulse' : ''}`}></div>
              </div>
              
              {/* Interactive Circuit Board */}
              <div 
                className={`h-16 bg-gradient-to-r from-muted/30 to-muted/60 rounded border-2 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  activeCircuit === system.id ? 'border-terminal shadow-lg shadow-terminal/20' : 'border-muted hover:border-primary/50'
                }`}
                onClick={() => handleCircuitClick(system.id)}
              >
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 gap-1 p-2">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 h-1 rounded-full transition-all duration-200 ${
                        system.switchState && system.status === 'online' 
                          ? 'bg-terminal animate-pulse' 
                          : system.status === 'warning'
                          ? 'bg-warning' 
                          : 'bg-muted'
                      }`}
                      style={{ animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
                {activeCircuit === system.id && (
                  <div className="absolute inset-0 bg-terminal/10 animate-pulse" />
                )}
              </div>

              {/* Power Level Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Power Level</span>
                  <span className="text-terminal font-mono">{system.powerLevel || 0}%</span>
                </div>
                <Slider
                  value={[system.powerLevel || 0]}
                  onValueChange={(value) => handlePowerChange(system.id, value)}
                  max={100}
                  step={5}
                  className="w-full"
                  disabled={!system.switchState}
                />
              </div>

              {/* Temperature Gauge */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Temp</span>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-16 rounded-full overflow-hidden ${
                    (system.temperature || 0) > 80 ? 'bg-destructive/20' : 'bg-muted'
                  }`}>
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        (system.temperature || 0) > 80 ? 'bg-destructive animate-pulse' : 
                        (system.temperature || 0) > 60 ? 'bg-warning' : 'bg-terminal'
                      }`}
                      style={{ width: `${system.temperature || 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {system.temperature || 0}°C
                  </span>
                </div>
              </div>
              
              {/* Main Switch */}
              <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                <span className="text-sm font-medium">
                  {system.switchState ? 'ENABLED' : 'DISABLED'}
                </span>
                <button
                  onClick={() => handleSwitchToggle(system.id, system.switchState)}
                  className={`switch-button ${system.switchState ? 'active' : ''} transition-transform hover:scale-105`}
                >
                  <div className="switch-knob"></div>
                </button>
              </div>

              {/* Status Bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    system.status === 'online' ? 'bg-terminal w-full animate-pulse' :
                    system.status === 'warning' ? 'bg-warning w-2/3' :
                    'bg-destructive w-1/4'
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-destructive/10 border border-destructive/30 rounded">
          <h3 className="font-bold text-destructive mb-2">⚠ CRITICAL SYSTEMS FAILURE</h3>
          <p className="text-sm text-destructive/80">
            Life support systems compromised. Follow engineer's instructions to restore power.
            Time remaining: Mission clock active.
          </p>
        </div>
      </Card>

      <Card className="control-panel">
        <h3 className="text-lg font-bold text-primary mb-4">DIAGNOSTIC PANEL</h3>
        <div className="terminal-screen space-y-2 text-sm">
          <div className="text-terminal">[SYSTEM] Initializing diagnostic protocols...</div>
          <div className="text-warning">[WARNING] Power fluctuations detected</div>
          <div className="text-destructive">[ERROR] Primary systems offline</div>
          <div className="text-muted-foreground">[INFO] Awaiting engineer instructions...</div>
          
          {/* Real-time system readings */}
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            {systemsStatus.map((system) => (
              <div key={system.id} className="flex justify-between">
                <span className="text-muted-foreground">{system.name}:</span>
                <span className={`font-mono ${
                  system.status === 'online' ? 'text-terminal' :
                  system.status === 'warning' ? 'text-warning' : 'text-destructive'
                }`}>
                  {system.status.toUpperCase()} {system.powerLevel || 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};