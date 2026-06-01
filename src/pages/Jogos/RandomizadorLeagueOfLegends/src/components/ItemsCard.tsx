import React from 'react';
import type { BuildItem } from '../types/randomizer';

interface ItemsCardProps {
  items: BuildItem[];
}

export const ItemsCard: React.FC<ItemsCardProps> = ({ items }) => {
  return (
    <div className="card">
      <h2>Build</h2>
      <div className="items-list" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {items.map((item, idx) => {
          // Define o caminho da imagem com base se é bota ou item comum
          const imagePath = item.isBoot 
            ? `${item.image}`
            : `${item.image}`;

          return (
            <div 
              className={`item ${item.isCore ? 'core-item' : ''}`} 
              key={idx} 
              style={{ 
                position: 'relative', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                width: '80px' // ajuste conforme seu layout
              }}
            >
              {item.isCore ? (
                /* Se for CORE: Não exibe imagem, renderiza um bloco de texto escrito CORE */
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#1a1a2e',
                  border: '2px dashed #d4af37',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4af37',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  boxShadow: '0 0 8px rgba(212, 175, 55, 0.4)'
                }}>
                  Core
                </div>
              ) : (
                <img
                  src={imagePath}
                  alt={item.name}
                  style={{ width: '64px', height: '64px', borderRadius: '4px' }}
                />
              )}
              
              <span style={{ fontSize: '12px', textAlign: 'center', marginTop: '5px', color: '#fff' }}>
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};