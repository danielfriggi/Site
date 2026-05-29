import React from 'react';
import type { RunePageResult } from '../types/randomizer';

interface RunesCardProps {
  runePage: RunePageResult;
}

export const RunesCard: React.FC<RunesCardProps> = ({ runePage }) => {
  return (
    <div className="card">
      <h2>Runas</h2>

      <div>
        <h3>Primária — {runePage.primaryTree.name}</h3>
        <div className="runes-list">
          <div className="rune">
            <img src={runePage.primaryRune.img} alt={runePage.primaryRune.name} />
            <span>{runePage.primaryRune.name}</span>
          </div>
          {runePage.primaryChoices.map((rune, idx) => (
            <div className="rune" key={idx}>
              <img src={rune.img} alt={rune.name} />
              <span>{rune.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3>Secundária — {runePage.secondaryTree.name}</h3>
        <div className="runes-list">
          {runePage.secondaryChoices.map((rune, idx) => (
            <div className="rune" key={idx}>
              <img src={rune.img} alt={rune.name} />
              <span>{rune.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3>Atributos</h3>
        <div className="runes-list">
          {runePage.shards.map((shard, idx) => (
            <div className="rune" key={idx}>
              <img src={shard.img} alt={shard.name} />
              <span>{shard.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};