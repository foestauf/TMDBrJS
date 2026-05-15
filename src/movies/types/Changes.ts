export interface MovieChangeItem {
  id: string;
  action: string;
  time: string;
  iso6391?: string;
  iso31661?: string;
  value?: unknown;
  originalValue?: unknown;
}

export interface MovieChanges {
  changes: Array<{
    key: string;
    items: MovieChangeItem[];
  }>;
}
