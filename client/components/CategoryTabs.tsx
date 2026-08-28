"use client";

interface Category {
  id: string;
  title: string;
}

interface Props {
  categories: Category[];
  activeId?: string;
  onSelect: (id?: string) => void;
}

export function CategoryTabs({ categories, activeId, onSelect }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(undefined)}
        className={`shrink-0 rounded-full px-4 py-1 text-sm transition ${
          !activeId
            ? "bg-red-600 text-white"
            : "bg-muted text-foreground hover:bg-muted/70"
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`shrink-0 rounded-full px-4 py-1 text-sm transition ${
            activeId === c.id
              ? "bg-red-600 text-white"
              : "bg-muted text-foreground hover:bg-muted/70"
          }`}
        >
          {c.title}
        </button>
      ))}
    </div>
  );
}
