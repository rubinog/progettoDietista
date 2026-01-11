export const CATEGORIES = {
  CEREALI: { id: 'cereali', label: 'Cereali e Patate', color: 'var(--color-cereali)' },
  LATTE: { id: 'latte', label: 'Latte/yogurt', color: 'var(--color-latte)' },
  FORMAGGI: { id: 'formaggi', label: 'Formaggi', color: 'var(--color-formaggi)' },
  FRUTTA: { id: 'frutta', label: 'Frutta e verdura', color: 'var(--color-frutta)' }, // Note: Image groups them
  CARNE: { id: 'carne', label: 'Carne', color: 'var(--color-carne)' },
  PESCE: { id: 'pesce', label: 'Pesce', color: 'var(--color-pesce)' },
  LEGUMI: { id: 'legumi', label: 'Legumi', color: 'var(--color-legumi)' },
  UOVA: { id: 'uova', label: 'Uova', color: 'var(--color-uova)' },
  DOLCI: { id: 'dolci', label: 'Dolci', color: 'var(--color-dolci)' },
};

// Helper to find category by label (for initial data loading if needed)
export const getCategoryByLabel = (label) => {
  return Object.values(CATEGORIES).find(c => c.label === label);
};
