import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SystemStatus {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  switchState: boolean;
}

interface ControlPanelProps {
  onSystemChange: (systemId: string, newState: boolean) => void;
  systemsStatus: SystemStatus[];
}

export const ControlPanel = ({ onSystemChange, systemsStatus }: ControlPanelProps) => {
  const [emergencyBlink, setEmergencyBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmergencyBlink(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSwitchToggle = (systemId: string, currentState: boolean) => {
    onSystemChange(systemId, !currentState);
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
            <div key={system.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{system.name}</span>
                <div className={`status-indicator ${system.status}`}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {system.switchState ? 'ENABLED' : 'DISABLED'}
                </span>
                <button
                  onClick={() => handleSwitchToggle(system.id, system.switchState)}
                  className={`switch-button ${system.switchState ? 'active' : ''}`}
                >
                  <div className="switch-knob"></div>
                </button>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    system.status === 'online' ? 'bg-terminal w-full' :
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
        </div>
      </Card>
    </div>
  );
};