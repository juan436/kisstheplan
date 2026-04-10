export type ScriptTimeType = 'exact' | 'range' | 'none';

export interface ScriptEntry {
  id: string;
  timeType: ScriptTimeType;
  timeStart?: string;
  timeEnd?: string;
  title: string;
  description?: string;
  style: {
    bold?: boolean;
    color?: string;
    fontSize?: 'sm' | 'base' | 'lg' | 'xl';
  };
  order: number;
}

export interface ScriptArea {
  id: string;
  name: string;
  imageUrl?: string;
  order: number;
}
