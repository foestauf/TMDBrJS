export interface PersonChangeItem {
  id: string;
  action: string;
  time: string;
  iso6391?: string;
  iso31661?: string;
  value?: unknown;
  originalValue?: unknown;
}

export interface PersonChanges {
  changes: Array<{
    key: string;
    items: PersonChangeItem[];
  }>;
}
