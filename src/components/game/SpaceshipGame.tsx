import { useState, useEffect } from "react";
import { ControlPanel } from "./ControlPanel";
import { InstructionsPanel } from "./InstructionsPanel";
import { ChatSystem } from "./ChatSystem";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SystemStatus {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  switchState: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  glitched?: boolean;
  delayed?: boolean;
}

interface Instruction {
  id: string;
  step: number;
  text: string;
  completed: boolean;
  critical: boolean;
}

interface SpaceshipGameProps {
  playerName: string;
  playerRole: 'engineer' | 'operator';
  onExitGame: () => void;
}

export const SpaceshipGame = ({ playerName, playerRole, onExitGame }: SpaceshipGameProps) => {
  const [gameTimer, setGameTimer] = useState(300); // 5 minutes
  const [gameStatus, setGameStatus] = useState<'playing' | 'success' | 'failure'>('playing');
  const [currentStep, setCurrentStep] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'unstable' | 'offline'>('unstable');
  
  const [systemsStatus, setSystemsStatus] = useState<SystemStatus[]>([
    { id: 'power', name: 'PRIMARY POWER', status: 'offline', switchState: false },
    { id: 'life_support', name: 'LIFE SUPPORT', status: 'warning', switchState: true },
    { id: 'navigation', name: 'NAVIGATION', status: 'offline', switchState: false },
    { id: 'communications', name: 'LONG RANGE COMM', status: 'offline', switchState: false },
    { id: 'engines', name: 'ENGINE SYSTEMS', status: 'offline', switchState: false },
    { id: 'shields', name: 'DEFLECTOR SHIELDS', status: 'warning', switchState: true },
  ]);

  const [instructions] = useState<Instruction[]>([
    { id: '1', step: 1, text: 'Tell operator to enable PRIMARY POWER switch first', completed: false, critical: true },
    { id: '2', step: 2, text: 'Once power is stable, enable NAVIGATION SYSTEMS', completed: false, critical: true },
    { id: '3', step: 3, text: 'Restore ENGINE SYSTEMS to prevent orbital decay', completed: false, critical: true },
    { id: '4', step: 4, text: 'Enable LONG RANGE COMM to contact mission control', completed: false, critical: false },
    { id: '5', step: 5, text: 'Verify all systems are online and stable', completed: false, critical: true },
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'SYSTEM',
      text: 'Emergency protocols activated. Engineer and Operator connected.',
      timestamp: new Date(),
    }
  ]);

  // Timer countdown
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    const timer = setInterval(() => {
      setGameTimer(prev => {
        if (prev <= 1) {
          setGameStatus('failure');
          toast.error("Time's up! Life support systems failed.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  // Simulate connection instability
  useEffect(() => {
    const connectionTimer = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.7) {
        setConnectionStatus('unstable');
      } else if (rand < 0.9) {
        setConnectionStatus('online');
      } else {
        setConnectionStatus('offline');
      }
    }, 3000);

    return () => clearInterval(connectionTimer);
  }, []);

  const handleSystemChange = (systemId: string, newState: boolean) => {
    setSystemsStatus(prev => prev.map(system => {
      if (system.id === systemId) {
        const updatedSystem = { ...system, switchState: newState };
        
        // Update system status based on correct sequence
        if (systemId === 'power' && newState) {
          updatedSystem.status = 'online';
          toast.success("Primary power restored!");
        } else if (systemId === 'navigation' && newState && systemsStatus.find(s => s.id === 'power')?.switchState) {
          updatedSystem.status = 'online';
          toast.success("Navigation systems online!");
        } else if (systemId === 'engines' && newState && systemsStatus.find(s => s.id === 'navigation')?.switchState) {
          updatedSystem.status = 'online';
          toast.success("Engine systems restored!");
        } else if (systemId === 'communications' && newState) {
          updatedSystem.status = 'online';
          toast.success("Long range communications restored!");
        } else if (!newState) {
          updatedSystem.status = 'offline';
        }

        return updatedSystem;
      }
      return system;
    }));

    // Check win condition
    setTimeout(() => checkWinCondition(), 500);
  };

  const checkWinCondition = () => {
    const criticalSystems = ['power', 'navigation', 'engines'];
    const allCriticalOnline = criticalSystems.every(id => 
      systemsStatus.find(s => s.id === id)?.status === 'online'
    );

    if (allCriticalOnline) {
      setGameStatus('success');
      toast.success("Mission accomplished! All critical systems restored!");
    }
  };

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: playerName,
      text: message,
      timestamp: new Date(),
      glitched: connectionStatus === 'unstable' && Math.random() < 0.3,
      delayed: connectionStatus === 'unstable' && Math.random() < 0.2,
    };

    if (newMessage.delayed) {
      setTimeout(() => {
        setMessages(prev => [...prev, newMessage]);
      }, 2000 + Math.random() * 3000);
    } else {
      setMessages(prev => [...prev, newMessage]);
    }

    // Simulate other player responses (for demo)
    if (Math.random() < 0.3) {
      setTimeout(() => {
        const responses = [
          "Roger that, checking now...",
          "Which system exactly?",
          "I see multiple switches here",
          "Status confirmed",
          "Unable to locate that control",
          "Power levels fluctuating",
        ];
        
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: playerRole === 'engineer' ? 'OPERATOR' : 'ENGINEER',
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          glitched: connectionStatus === 'unstable' && Math.random() < 0.2,
        };

        setMessages(prev => [...prev, response]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="control-panel max-w-2xl w-full text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h1 className="text-3xl font-bold text-success mb-4">MISSION SUCCESS</h1>
          <p className="text-lg mb-6">
            Excellent teamwork! All critical systems restored with {formatTime(gameTimer)} remaining.
          </p>
          <Button onClick={onExitGame} className="btn-terminal">
            RETURN TO LOBBY
          </Button>
        </div>
      </div>
    );
  }

  if (gameStatus === 'failure') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="control-panel max-w-2xl w-full text-center">
          <div className="text-6xl mb-4">💥</div>
          <h1 className="text-3xl font-bold text-destructive mb-4">MISSION FAILED</h1>
          <p className="text-lg mb-6">
            Life support systems critical failure. Better communication is key to survival.
          </p>
          <Button onClick={onExitGame} className="btn-emergency">
            RETURN TO LOBBY
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            {playerRole.toUpperCase()} - {playerName}
          </h1>
          <p className="text-muted-foreground">Emergency Repair Mission</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-mono text-warning">{formatTime(gameTimer)}</div>
            <div className="text-xs text-muted-foreground">TIME REMAINING</div>
          </div>
          <Button onClick={onExitGame} variant="outline" className="border-destructive text-destructive">
            EXIT MISSION
          </Button>
        </div>
      </div>

      {/* Main Game Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Left Panel - Role-specific content */}
        <div className="lg:col-span-2">
          {playerRole === 'operator' ? (
            <ControlPanel 
              onSystemChange={handleSystemChange}
              systemsStatus={systemsStatus}
            />
          ) : (
            <InstructionsPanel 
              instructions={instructions}
              currentStep={currentStep}
            />
          )}
        </div>

        {/* Right Panel - Chat */}
        <div>
          <ChatSystem
            playerName={playerName}
            messages={messages}
            onSendMessage={handleSendMessage}
            connectionStatus={connectionStatus}
          />
        </div>
      </div>
    </div>
  );
};