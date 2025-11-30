
const colorList = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F1C40F",
  "#8E44AD",
  "#E67E22",
  "#1ABC9C",
  "#C0392B",
  "#2C3E50",
  "#D35400",
];

export const getPortfolioColor = (
  selectedPortfolio: number | null,
  portfolios: { id: number }[]
): string => {
  if (!selectedPortfolio || portfolios.length === 0) return "#000"; // fallback color

  const index = portfolios.findIndex((p) => p.id === selectedPortfolio);

  if (index === -1) return "#000"; // fallback if not found

  return colorList[index % colorList.length];
};
