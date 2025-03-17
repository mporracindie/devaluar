import { InflationData } from '../types';

export async function fetchInflationData(): Promise<InflationData[]> {
  const response = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion');
  return response.json();
}

export function calculateCurrentValue(
  amount: number,
  originalDate: string,
  inflationData: InflationData[]
): number {
  // Sort inflation data by date
  const sortedData = [...inflationData].sort((a, b) => 
    new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  // Find the starting point in the inflation data
  const startIndex = sortedData.findIndex(
    data => data.fecha.startsWith(originalDate)
  );

  if (startIndex === -1) return amount;

  // Calculate cumulative inflation
  let currentValue = amount;
  for (let i = startIndex; i < sortedData.length; i++) {
    currentValue *= (1 + sortedData[i].valor / 100);
  }

  return Math.round(currentValue);
}