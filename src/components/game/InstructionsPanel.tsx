import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, AlertTriangle } from "lucide-react";

interface Instruction {
  id: string;
  step: number;
  text: string;
  completed: boolean;
  critical: boolean;
}

interface InstructionsPanelProps {
  instructions: Instruction[];
  currentStep: number;
  onSchematicClick?: (schematicId: string) => void;
}

export const InstructionsPanel = ({ instructions, currentStep, onSchematicClick }: InstructionsPanelProps) => {
  const [selectedSchematic, setSelectedSchematic] = useState<string | null>(null);
  const [highlightedComponent, setHighlightedComponent] = useState<string | null>(null);

  const schematics = [
    { id: 'power', name: 'Power Distribution', color: 'text-terminal' },
    { id: 'life_support', name: 'Life Support Grid', color: 'text-warning' },
    { id: 'navigation', name: 'Nav Computer', color: 'text-terminal' },
    { id: 'communications', name: 'Comm Array', color: 'text-primary' },
    { id: 'engines', name: 'Engine Matrix', color: 'text-destructive' },
    { id: 'shields', name: 'Shield Generator', color: 'text-warning' },
  ];

  const handleSchematicClick = (schematicId: string) => {
    setSelectedSchematic(selectedSchematic === schematicId ? null : schematicId);
    onSchematicClick?.(schematicId);
  };

  const SchematicDiagram = ({ schematic }: { schematic: typeof schematics[0] }) => (
    <div className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
      selectedSchematic === schematic.id 
        ? 'border-terminal bg-terminal/5 shadow-lg shadow-terminal/20' 
        : 'border-muted hover:border-primary/50'
    }`}
    onClick={() => handleSchematicClick(schematic.id)}>
      <div className="text-center mb-2">
        <h4 className={`text-sm font-bold ${schematic.color}`}>{schematic.name}</h4>
      </div>
      
      {/* Simplified circuit diagram */}
      <div className="grid grid-cols-4 grid-rows-3 gap-1 h-16">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`w-full h-full rounded transition-all duration-200 cursor-pointer ${
              selectedSchematic === schematic.id && highlightedComponent === `${schematic.id}-${i}`
                ? 'bg-terminal animate-pulse shadow-lg shadow-terminal/40'
                : selectedSchematic === schematic.id
                ? 'bg-primary/30 hover:bg-primary/50'
                : 'bg-muted hover:bg-muted/70'
            }`}
            onMouseEnter={() => setHighlightedComponent(`${schematic.id}-${i}`)}
            onMouseLeave={() => setHighlightedComponent(null)}
          />
        ))}
      </div>
      
      {selectedSchematic === schematic.id && (
        <div className="mt-2 text-xs text-terminal animate-fade-in">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-mono">ANALYZING...</span>
          </div>
          <Progress value={33 + Math.random() * 60} className="mt-1 h-1" />
        </div>
      )}
    </div>
  );
  return (
    <div className="space-y-6">
      {/* Interactive Schematic Display */}
      <Card className="control-panel">
        <h3 className="text-lg font-bold text-primary mb-4">SYSTEM SCHEMATICS</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {schematics.map((schematic) => (
            <SchematicDiagram key={schematic.id} schematic={schematic} />
          ))}
        </div>
        
        {selectedSchematic && (
          <div className="border-t border-primary/20 pt-4">
            <div className="terminal-screen text-sm space-y-1">
              <div className="text-terminal">[SCHEMATIC] {schematics.find(s => s.id === selectedSchematic)?.name} selected</div>
              <div className="text-warning">[ANALYSIS] Click components for detailed view</div>
              <div className="text-muted-foreground">[TIP] Cross-reference with operator panel</div>
            </div>
          </div>
        )}
      </Card>

      {/* Enhanced Mission Instructions */}
      <Card className="control-panel">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">REPAIR MANUAL</h2>
          <div className="text-terminal text-sm font-mono">
            STEP {currentStep + 1} / {instructions.length}
          </div>
        </div>

        <div className="space-y-3">
          {instructions.map((instruction, index) => (
            <div 
              key={instruction.id} 
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                instruction.completed 
                  ? 'border-terminal bg-terminal/10 shadow-lg shadow-terminal/20' 
                  : index === currentStep
                  ? 'border-warning bg-warning/10 animate-pulse shadow-lg shadow-warning/20'
                  : instruction.critical 
                  ? 'border-destructive/50 bg-destructive/5'
                  : 'border-muted bg-muted/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  instruction.completed 
                    ? 'bg-terminal text-background animate-pulse' 
                    : index === currentStep
                    ? 'bg-warning text-background animate-bounce'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {instruction.completed ? '✓' : instruction.step}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium transition-colors duration-300 ${
                    instruction.completed 
                      ? 'text-terminal' 
                      : index === currentStep
                      ? 'text-warning'
                      : instruction.critical 
                      ? 'text-destructive' 
                      : 'text-foreground'
                  }`}>
                    {instruction.text}
                  </p>
                  
                  {instruction.critical && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                      <span className="text-xs text-destructive font-bold">CRITICAL</span>
                    </div>
                  )}
                  
                  {index === currentStep && (
                    <div className="mt-2">
                      <Progress value={75} className="h-1" />
                      <div className="text-xs text-warning mt-1 animate-pulse">Current objective</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-warning/10 border border-warning/30 rounded">
          <h3 className="font-bold text-warning mb-2">📋 ENGINEER INSTRUCTIONS</h3>
          <p className="text-sm text-warning/80">
            Guide the operator through each step. You cannot touch any controls - 
            communication is your only tool. Be precise and clear.
          </p>
        </div>
      </Card>

      <Card className="control-panel">
        <h3 className="text-lg font-bold text-primary mb-4">SYSTEM OVERVIEW</h3>
        <div className="terminal-screen space-y-2 text-sm">
          <div className="text-terminal">[MANUAL] Emergency repair protocol loaded</div>
          <div className="text-primary">[INFO] Operator controls all physical systems</div>
          <div className="text-warning">[WARNING] Communication may be disrupted</div>
          <div className="text-muted-foreground">[GUIDE] Direct operator through each step</div>
        </div>
      </Card>
    </div>
  );
};