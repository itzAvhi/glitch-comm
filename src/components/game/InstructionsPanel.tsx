import { Card } from "@/components/ui/card";
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
}

export const InstructionsPanel = ({ instructions, currentStep }: InstructionsPanelProps) => {
  return (
    <div className="space-y-6">
      <Card className="control-panel">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">REPAIR MANUAL</h2>
          <div className="text-terminal text-sm font-mono">
            STEP {currentStep + 1} / {instructions.length}
          </div>
        </div>

        <div className="space-y-4">
          {instructions.map((instruction, index) => (
            <div 
              key={instruction.id}
              className={`flex items-start gap-3 p-3 rounded border transition-all ${
                index === currentStep 
                  ? 'border-primary bg-primary/5' 
                  : instruction.completed 
                    ? 'border-success/30 bg-success/5' 
                    : 'border-border bg-muted/20'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {instruction.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : index === currentStep ? (
                  <Circle className="w-5 h-5 text-primary animate-pulse" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm text-muted-foreground">
                    STEP {instruction.step}
                  </span>
                  {instruction.critical && (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  )}
                </div>
                <p className={`${
                  index === currentStep ? 'text-foreground font-medium' : 
                  instruction.completed ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {instruction.text}
                </p>
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