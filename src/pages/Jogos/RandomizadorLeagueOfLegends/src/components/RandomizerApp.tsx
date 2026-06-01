import React, { useEffect, useState, useCallback } from 'react';
import type { DDragonChampion, BuildItem, GeneratedBuild, Role } from '../types/randomizer';
import { fetchChampions, fetchItems, generateRunePage } from '../services/ddragon';
import { ChampionCard } from './ChampionCard';
import { RunesCard } from './RuneCard';
import { ItemsCard } from './ItemsCard';
import "../../randomizer.css";

const ROLES: Role[] = ['Top', 'Jungle', 'Mid', 'ADC', 'Suporte'];

const pickOne = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

export const RandomizerApp: React.FC = () => {
  const [champions, setChampions] = useState<DDragonChampion[]>([]);
  const [allItems, setAllItems] = useState<BuildItem[]>([]);
  const [currentBuild, setCurrentBuild] = useState<GeneratedBuild | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Requisito 3: Estado para controlar se é Full Random ou Random Parcial
  const [randomMode, setRandomMode] = useState<'full' | 'parcial'>('full');

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

  // Função interna para separar e estruturar os itens com base na role sorteada
  const getSelectedItemsByRole = useCallback((role: Role): BuildItem[] => {
    // Requisito 4 e 2: Separa os itens carregados por categoria
    const boots = allItems.filter(item => item.isBoot);
    const supportItems = allItems.filter(item => item.isSupportItem);
    const regularItems = allItems.filter(item => !item.isBoot && !item.isSupportItem);

    const chosenBoot = pickOne(boots);
    let selected: BuildItem[] = [];

    // Requisito 2: Regras específicas de quantidades de itens e botas por rota
    if (role === 'Suporte') {
      // 2.2 - se for sup: 4 itens normais, 1 bota e 1 item de suporte
      const shuffledRegular = [...regularItems].sort(() => 0.5 - Math.random());
      const shuffledSupport = [...supportItems].sort(() => 0.5 - Math.random());
      
      // Garante que pegamos ao menos um item de suporte válido se houver na lista
      const chosenSupport = shuffledSupport[0] || pickOne(regularItems); 

      selected = [...shuffledRegular.slice(0, 4), chosenBoot, chosenSupport];
    } else if (role === 'ADC') {
      // 2.1 - se for adc: 6 itens normais e 1 bota (7 slots no total de build final)
      const shuffledRegular = [...regularItems].sort(() => 0.5 - Math.random());
      selected = [...shuffledRegular.slice(0, 6), chosenBoot];
    } else {
      // Fluxo padrão (Top, JG, Mid): 5 itens normais e 1 bota
      const shuffledRegular = [...regularItems].sort(() => 0.5 - Math.random());
      selected = [...shuffledRegular.slice(0, 5), chosenBoot];
    }

    // Requisito 3: Se escolher parcial, os 2 primeiros itens ganham a propriedade "isCore"
    if (randomMode === 'parcial') {
      let coreCount = 0;
      selected = selected.map((item) => {
        // Marca como "core" se for um dos dois primeiros itens e não for uma bota
        if (coreCount < 2 && !item.isBoot) {
          coreCount++;
          return { ...item, isCore: true };
        }
        return { ...item, isCore: false };
      });
    } else {
      // Limpa a propriedade caso estivesse ativa em um sorteio anterior
      selected = selected.map(item => ({ ...item, isCore: false }));
    }

    return selected;
  }, [allItems, randomMode]);

  // Função para gerar a build aleatória
  const handleGenerateBuild = useCallback(() => {
    if (!champions.length || !allItems.length) return;

    const randomChampion = champions[Math.floor(Math.random() * champions.length)];
    
    // Requisito 1: Sorteia uma função (role) para o campeão
    const randomRole = pickOne(ROLES);

    // Gera os itens respeitando as regras da role e o modo selecionado
    const selectedItems = getSelectedItemsByRole(randomRole);

    const runePage = generateRunePage();

    setCurrentBuild({
      champion: randomChampion,
      role: randomRole, // Enviando a role sorteada para o estado global da build
      items: selectedItems,
      runePage
    });
  }, [champions, allItems, getSelectedItemsByRole]);

  // Gera a primeira build automaticamente assim que os dados carregarem
  useEffect(() => {
    if (!loading && champions.length && allItems.length) {
      handleGenerateBuild();
    }
  }, [loading, champions, allItems, handleGenerateBuild]);

  return (
    <div className="container randomizer-body">
      <h1>Como vou jogar hoje?</h1>

      {/* Requisito 3: Interface para alternar os modos de sorteio */}
      <div className="mode-selector" style={{ marginBottom: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <label style={{ color: '#fff', cursor: 'pointer', fontSize: '16px' }}>
          <input 
            type="radio" 
            name="randomMode" 
            value="full"
            checked={randomMode === 'full'} 
            onChange={() => setRandomMode('full')}
            style={{ marginRight: '8px' }}
          /> 
          Full Random
        </label>
        <label style={{ color: '#fff', cursor: 'pointer', fontSize: '16px' }}>
          <input 
            type="radio" 
            name="randomMode" 
            value="parcial"
            checked={randomMode === 'parcial'} 
            onChange={() => setRandomMode('parcial')}
            style={{ marginRight: '8px' }}
          /> 
          Random Parcial (2 Itens Core)
        </label>
      </div>

      {loading ? (
        <div id="app" className="loading">
          Carregando caos ranqueado...
        </div>
      ) : (
        currentBuild && (
          <div className="content">
            {/* Requisito 1: Passando a role sorteada para o card do campeão exibir embaixo dele */}
            <ChampionCard champion={currentBuild.champion} role={currentBuild.role} />
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