// pages/Jogos/RandomizerLeagueOfLegends/RandomizerLeagueOfLegends.tsx
import React from 'react';
import { RandomizerApp } from './src/components/RandomizerApp';

const RandomizerLeagueOfLegends: React.FC = () => {
  return (
    <div className="game-page-wrapper">
      {/* Se tiver um Header ou Menu lateral compartilhado nos seus jogos, entra aqui */}
      <RandomizerApp />
    </div>
  );
};

export default RandomizerLeagueOfLegends;