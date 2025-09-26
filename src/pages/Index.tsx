import { useState } from "react";
import { GameLobby } from "@/components/game/GameLobby";
import { SpaceshipGame } from "@/components/game/SpaceshipGame";

const Index = () => {
  const [gameState, setGameState] = useState<'lobby' | 'playing'>('lobby');
  const [playerName, setPlayerName] = useState('');
  const [playerRole, setPlayerRole] = useState<'engineer' | 'operator'>('engineer');

  const handleStartGame = (name: string, role: 'engineer' | 'operator') => {
    setPlayerName(name);
    setPlayerRole(role);
    setGameState('playing');
  };

  const handleExitGame = () => {
    setGameState('lobby');
  };

  if (gameState === 'lobby') {
    return <GameLobby onStartGame={handleStartGame} />;
  }

  return (
    <SpaceshipGame 
      playerName={playerName}
      playerRole={playerRole}
      onExitGame={handleExitGame}
    />
  );
};

export default Index;
