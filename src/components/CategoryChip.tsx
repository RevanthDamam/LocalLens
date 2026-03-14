import type { Category } from "@/data/mockData";
import { CATEGORY_ICONS } from "@/data/mockData";

interface CategoryChipProps {
  category: Category;
  active: boolean;
  onClick: () => void;
}

export function CategoryChip({ category, active, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
      }`}
    >
      <span>{CATEGORY_ICONS[category]}</span>
      {category}
    </button>
  );
}
