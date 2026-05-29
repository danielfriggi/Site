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

export interface BuildItem {
  name: string;
  image: string;
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
  items: BuildItem[];
  runePage: RunePageResult;
}