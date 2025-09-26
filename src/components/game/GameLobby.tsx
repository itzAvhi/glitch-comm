import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface GameLobbyProps {
  onStartGame: (playerName: string, role: 'engineer' | 'operator') => void;
}

export const GameLobby = ({ onStartGame }: GameLobbyProps) => {
  const [playerName, setPlayerName] = useState("");
  const [selectedRole, setSelectedRole] = useState<'engineer' | 'operator' | null>(null);

  const handleStartGame = () => {
    if (playerName.trim() && selectedRole) {
      onStartGame(playerName.trim(), selectedRole);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="control-panel max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            SPACESHIP COMMUNICATION PROTOCOL
          </h1>
          <p className="text-muted-foreground text-lg">
            Two-player cooperative emergency repair mission
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter Your Callsign
            </label>
            <Input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g., NOVA-7, FALCON-2..."
              className="terminal-screen text-terminal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-4">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`p-6 cursor-pointer border-2 transition-all ${
                  selectedRole === 'engineer' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedRole('engineer')}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <h3 className="font-bold text-lg text-primary">ENGINEER</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    You have the repair manual and instructions, but cannot interact with the ship's controls
                  </p>
                  <div className="mt-3 text-xs text-terminal">
                    ✓ Sees repair procedures<br/>
                    ✗ Cannot touch controls
                  </div>
                </div>
              </Card>

              <Card 
                className={`p-6 cursor-pointer border-2 transition-all ${
                  selectedRole === 'operator' 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedRole('operator')}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🔧</div>
                  <h3 className="font-bold text-lg text-primary">OPERATOR</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    You control the ship's systems but don't know what needs to be done
                  </p>
                  <div className="mt-3 text-xs text-terminal">
                    ✓ Controls all systems<br/>
                    ✗ No repair manual
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded border border-warning/30">
            <h4 className="font-bold text-warning mb-2">⚠ MISSION BRIEFING</h4>
            <p className="text-sm">
              Critical systems failure detected. Engineer and Operator must work together 
              to restore power before life support systems fail. Communication may be 
              affected by electromagnetic interference.
            </p>
          </div>

          <Button 
            onClick={handleStartGame}
            disabled={!playerName.trim() || !selectedRole}
            className="w-full btn-primary text-lg py-3"
          >
            {playerName.trim() && selectedRole ? 
              `INITIALIZE AS ${selectedRole.toUpperCase()}` : 
              'ENTER CALLSIGN AND SELECT ROLE'
            }
          </Button>
        </div>
      </Card>
    </div>
  );
};