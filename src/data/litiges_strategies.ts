
export interface LitigeStrategy {
  id: string;
  icon: string;
  chartData: number[]; // [Remboursement immédiat, Retour accepté, Litige gagné]
}

export const strategies: Record<string, LitigeStrategy> = {
  snad: {
    id: 'snad',
    icon: '🤔',
    chartData: [30, 50, 20],
  },
  mind: {
    id: 'mind',
    icon: '👕',
    chartData: [5, 15, 80],
  },
  damage: {
    id: 'damage',
    icon: '📦',
    chartData: [60, 20, 20],
  },
  fake: {
    id: 'fake',
    icon: '⚠️',
    chartData: [10, 40, 50],
  },
  lost: {
    id: 'lost',
    icon: '📪',
    chartData: [80, 10, 10],
  },
  scam: {
    id: 'scam',
    icon: '🚫',
    chartData: [100, 0, 0],
  }
};
