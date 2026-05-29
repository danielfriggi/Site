import React, { useEffect, useState, useCallback } from 'react';
import type { DDragonChampion, BuildItem, GeneratedBuild } from '../types/randomizer';
import { fetchChampions, fetchItems, generateRunePage } from '../services/ddragon';
import { ChampionCard } from './ChampionCard';
import { RunesCard } from './RuneCard';
import { ItemsCard } from './ItemsCard';
import "../../randomizer.css"

export const RandomizerApp: React.FC = () => {
  const [champions, setChampions] = useState<DDragonChampion[]>([]);
  const [allItems, setAllItems] = useState<BuildItem[]>([]);
  const [currentBuild, setCurrentBuild] = useState<GeneratedBuild | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Inicializa os dados da API da Riot
  useEffect(() => {
    async function initData() {
      try {
        const [champsData, itemsData] = await Promise.all([
          fetchChampions(),
          fetchItems()
        ]);
        setChampions(champsData);
        setAllItems(itemsData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados do Data Dragon:", error);
      }
    }
    initData();
  }, []);

  // Função para gear a build aleatória
  const handleGenerateBuild = useCallback(() => {
    if (!champions.length || !allItems.length) return;

    const randomChampion = champions[Math.floor(Math.random() * champions.length)];
    
    // Sorteia 6 itens sem repetição
    const shuffledItems = [...allItems].sort(() => 0.5 - Math.random());
    const selectedItems = shuffledItems.slice(0, 6);

    const runePage = generateRunePage();

    setCurrentBuild({
      champion: randomChampion,
      items: selectedItems,
      runePage
    });
  }, [champions, allItems]);

  // Gera a primeira build automaticamente assim que os dados carregarem
  useEffect(() => {
    if (!loading && champions.length && allItems.length) {
      handleGenerateBuild();
    }
  }, [loading, champions, allItems, handleGenerateBuild]);

  return (
    <div className="container randomizer-body">
      <h1>Como vou jogar hoje?</h1>

      {loading ? (
        <div id="app" className="loading">
          Carregando caos ranqueado...
        </div>
      ) : (
        currentBuild && (
          <div className="content">
            <ChampionCard champion={currentBuild.champion} />
            <RunesCard runePage={currentBuild.runePage} />
            <ItemsCard items={currentBuild.items} />
          </div>
        )
      )}

      <button onClick={handleGenerateBuild} disabled={loading}>
        RANDOMIZAR
      </button>
    </div>
  );
};