import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  glitched?: boolean;
  delayed?: boolean;
}

interface ChatSystemProps {
  playerName: string;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  connectionStatus: 'online' | 'unstable' | 'offline';
}

export const ChatSystem = ({ playerName, messages, onSendMessage, connectionStatus }: ChatSystemProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const applyGlitchEffect = (text: string, glitched: boolean) => {
    if (!glitched) return text;
    
    // Randomly scramble some characters
    const chars = text.split('');
    const scrambleChance = 0.15;
    
    return chars.map(char => {
      if (Math.random() < scrambleChance && char !== ' ') {
        const scrambleChars = ['#', '%', '@', '&', '*', '?', '!'];
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      }
      return char;
    }).join('');
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'online': return 'text-success';
      case 'unstable': return 'text-warning';
      case 'offline': return 'text-destructive';
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'online': return 'COMM STABLE';
      case 'unstable': return 'INTERFERENCE';
      case 'offline': return 'COMM FAILURE';
    }
  };

  return (
    <Card className="control-panel h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-primary">COMMUNICATIONS</h3>
        <div className="flex items-center gap-2">
          <div className={`status-indicator ${connectionStatus === 'online' ? 'online' : connectionStatus === 'unstable' ? 'warning' : 'offline'}`}></div>
          <span className={`text-sm font-mono ${getConnectionColor()}`}>
            {getConnectionText()}
          </span>
        </div>
      </div>

      <div className="terminal-screen flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">[{message.sender}]</span>
                <span>{message.timestamp.toLocaleTimeString()}</span>
              </div>
              <div className={`text-sm ${message.glitched ? 'glitched-text' : ''}`}>
                {message.delayed ? (
                  <span className="text-warning">
                    [SIGNAL DELAYED] {applyGlitchEffect(message.text, message.glitched || false)}
                  </span>
                ) : (
                  <span className="text-foreground">
                    {applyGlitchEffect(message.text, message.glitched || false)}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="text-xs text-muted-foreground animate-pulse">
              <span className="font-mono">[OTHER_PLAYER] typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={connectionStatus === 'offline' ? 'Communication offline...' : 'Type message...'}
            disabled={connectionStatus === 'offline'}
            className="flex-1 bg-background border-primary/30"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || connectionStatus === 'offline'}
            className="btn-primary px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {connectionStatus === 'unstable' && (
        <div className="mt-2 text-xs text-warning bg-warning/10 p-2 rounded border border-warning/30">
          ⚠ Electromagnetic interference detected. Messages may be scrambled or delayed.
        </div>
      )}
    </Card>
  );
};