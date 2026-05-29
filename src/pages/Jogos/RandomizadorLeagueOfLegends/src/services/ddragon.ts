import type { DDragonChampion, DDragonItem, BuildItem, RunePageResult } from '../types/randomizer';
import { RUNE_TREES } from '../constants/runes';

export const VERSION = '14.10.1';
const BASE_URL = `https://ddragon.leagueoflegends.com/cdn/${VERSION}`;

const pickOne = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

export async function fetchChampions(): Promise<DDragonChampion[]> {
  const res = await fetch(`${BASE_URL}/data/pt_BR/champion.json`);
  const data = await res.json();
  return Object.values(data.data);
}

export async function fetchItems(): Promise<BuildItem[]> {
  const res = await fetch(`${BASE_URL}/data/pt_BR/item.json`);
  const data = await res.json();
  
  return Object.values(data.data)
    .filter((item: any) => item.gold.total >= 2200 && item.maps['11'])
    .map((item: any) => ({
      name: item.name,
      image: item.image.full,
    }));
}

export function generateRunePage(): RunePageResult {
  const primaryTree = pickOne(RUNE_TREES);
  const primaryRune = pickOne(primaryTree.primary);
  const primaryChoices = primaryTree.groups.map(group => pickOne(group));

  const secondaryOptions = RUNE_TREES.filter(tree => tree.name !== primaryTree.name);
  const secondaryTree = pickOne(secondaryOptions);

  // Sorteia 2 grupos distintos dos 3 disponíveis na árvore secundária
  const shuffledGroups = [...secondaryTree.groups].sort(() => 0.5 - Math.random());
  const secondaryChoices = [
    pickOne(shuffledGroups[0]),
    pickOne(shuffledGroups[1]),
  ];

  const shards = [
    pickOne([
      { name: 'Velocidade de Ataque', img: '/img-lol/velocidade-de-ataque.png' },
      { name: 'Aceleração de Habilidade', img: '/img-lol/cdr.png' },
      { name: 'Força Adaptativa', img: '/img-lol/força.png' }
    ]),
    pickOne([
      { name: 'Força Adaptativa', img: '/img-lol/força.png' },
      { name: 'Velocidade de Movimento', img: '/img-lol/velocidade-de-movimento.png' },
      { name: 'Escalamento de Vida', img: '/img-lol/vida-escalavel.png' }
    ]),
    pickOne([
      { name: 'Vida', img: '/img-lol/vida.png' },
      { name: 'Tenacidade e Resistência a Lentidão', img: '/img-lol/tenacidade.png' },
      { name: 'Escalamento de Vida', img: '/img-lol/vida-escalavel.png' }
    ])
  ];

  return {
    primaryTree,
    primaryRune,
    primaryChoices,
    secondaryTree,
    secondaryChoices,
    shards
  };
}