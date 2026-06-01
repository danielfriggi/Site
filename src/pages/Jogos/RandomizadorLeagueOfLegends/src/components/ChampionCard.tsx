// components/ChampionCard.tsx

import React from 'react';
import type { DDragonChampion, Role } from '../types/randomizer';

interface ChampionCardProps {
  champion: DDragonChampion;
  role: Role;
}

export const ChampionCard: React.FC<ChampionCardProps> = ({ champion, role }) => {
  return (
    <div className="card">
      <h2>Campeão</h2>
      <img
        className="champion-img"
        src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`}
        alt={champion.name}
      />
      <div className="champion-name">
        {champion.name}
      </div>
      <div className="champion-role" style={{ marginTop: '10px', fontSize: '20px', color: '#60a5fa', fontWeight: 'bold' }}>
        Função: {role}
      </div>
    </div>
  );
};