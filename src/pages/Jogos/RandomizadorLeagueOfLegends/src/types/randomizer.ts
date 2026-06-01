export interface RuneItem {
  name: string;
  img: string;
}

export interface RuneTree {
  name: string;
  primary: RuneItem[];
  groups: RuneItem[][];
}

export interface DDragonChampion {
  id: string;
  name: string;
}

export interface DDragonItem {
  name: string;
  image: {
    full: string;
  };
  gold: {
    total: number;
  };
  maps: Record<string, boolean>;
}


export interface RunePageResult {
  primaryTree: RuneTree;
  primaryRune: RuneItem;
  primaryChoices: RuneItem[];
  secondaryTree: RuneTree;
  secondaryChoices: RuneItem[];
  shards: RuneItem[];
}


export type Role = 'Top' | 'Jungle' | 'Mid' | 'ADC' | 'Suporte';

export interface RuneItem {
  name: string;
  img: string;
}

export interface RuneTree {
  name: string;
  primary: RuneItem[];
  groups: RuneItem[][];
}

export interface DDragonChampion {
  id: string;
  name: string;
}

export interface BuildItem {
  name: string;
  image: string;
  isBoot: boolean;
  isSupportItem: boolean;
  isCore?: boolean;
}

export interface RunePageResult {
  primaryTree: RuneTree;
  primaryRune: RuneItem;
  primaryChoices: RuneItem[];
  secondaryTree: RuneTree;
  secondaryChoices: RuneItem[];
  shards: RuneItem[];
}

export interface GeneratedBuild {
  champion: DDragonChampion;
  role: Role; 
  items: BuildItem[];
  runePage: RunePageResult;
}