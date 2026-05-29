import React from 'react';
import type { BuildItem } from '../types/randomizer';
import { VERSION } from '../services/ddragon';

interface ItemsCardProps {
  items: BuildItem[];
}

export const ItemsCard: React.FC<ItemsCardProps> = ({ items }) => {
  return (
    <div className="card">
      <h2>Build</h2>
      <div className="items-list">
        {items.map((item, idx) => (
          <div className="item" key={idx}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/${VERSION}/img/item/${item.image}`}
              alt={item.name}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};