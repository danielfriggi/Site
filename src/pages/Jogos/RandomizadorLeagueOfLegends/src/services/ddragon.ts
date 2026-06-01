// services/ddragon.ts

import type {
  DDragonChampion,
  BuildItem,
  RunePageResult,
  Role
} from '../types/randomizer';

import { RUNE_TREES } from '../constants/runes';
import { ITEMS } from '../constants/items';
import { BOOTS } from '../constants/botas';

export const VERSION = '14.10.1';
const BASE_URL = `https://ddragon.leagueoflegends.com/cdn/${VERSION}`;

const pickOne = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

export async function fetchChampions(): Promise<DDragonChampion[]> {
  const res = await fetch(`${BASE_URL}/data/pt_BR/champion.json`);
  const data = await res.json();
  return Object.values(data.data);
}

export async function fetchItems(): Promise<BuildItem[]> {
  return [...ITEMS, ...BOOTS];
}

export function getRandomItems(
  allItems: BuildItem[],
  role: Role,
  isPartialRandom: boolean
): BuildItem[] {
  const boots = allItems.filter(item => item.isBoot);

  const supportItems = allItems.filter(
    item => item.isSupportItem && !item.isBoot
  );

  const regularItems = allItems.filter(
    item => !item.isBoot && !item.isSupportItem
  );

  const chosenBoot = pickOne(boots);

  let selectedItems: BuildItem[] = [];

  if (role === 'Suporte') {
    const shuffledRegular = [...regularItems].sort(
      () => Math.random() - 0.5
    );

    selectedItems = [
      ...shuffledRegular.slice(0, 4),
      chosenBoot,
      supportItems.length
        ? pickOne(supportItems)
        : pickOne(regularItems)
    ];
  } else if (role === 'ADC') {
    const shuffledRegular = [...regularItems].sort(
      () => Math.random() - 0.5
    );

    selectedItems = [
      ...shuffledRegular.slice(0, 6),
      chosenBoot
    ];
  } else {
    const shuffledRegular = [...regularItems].sort(
      () => Math.random() - 0.5
    );

    selectedItems = [
      ...shuffledRegular.slice(0, 5),
      chosenBoot
    ];
  }

  if (isPartialRandom) {
    let coreCount = 0;

    selectedItems = selectedItems.map(item => {
      if (!item.isBoot && coreCount < 2) {
        coreCount++;

        return {
          ...item,
          isCore: true
        };
      }

      return {
        ...item,
        isCore: false
      };
    });
  }

  return selectedItems;
}

export function generateRunePage(): RunePageResult {
  const primaryTree = pickOne(RUNE_TREES);
  const primaryRune = pickOne(primaryTree.primary);
  const primaryChoices = primaryTree.groups.map(group => pickOne(group));

  const secondaryOptions = RUNE_TREES.filter(
    tree => tree.name !== primaryTree.name
  );

  const secondaryTree = pickOne(secondaryOptions);

  const shuffledGroups = [...secondaryTree.groups].sort(
    () => Math.random() - 0.5
  );

  const secondaryChoices = [
    pickOne(shuffledGroups[0]),
    pickOne(shuffledGroups[1])
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