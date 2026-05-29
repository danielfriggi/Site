import React from 'react';
import type { DDragonChampion } from '../types/randomizer';

interface ChampionCardProps {
  champion: DDragonChampion;
}

export const ChampionCard: React.FC<ChampionCardProps> = ({ champion }) => {
  return (
    <div className="card">
      <h2>Campeão</h2>
      <img
        className="champion-img"
        src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`}
        alt={champion.name}
      />
      <div className="champion-name">{champion.name}</div>
    </div>
  );
};