export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM format
  amount: number;
  type: 'song' | 'movie' | 'news' | 'other';
  link?: string;
  artist?: string;
  source?: string;
}

export interface InflationData {
  fecha: string;
  valor: number;
}