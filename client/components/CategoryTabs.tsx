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
        className={`shrink-0 rounded-full px-4 py-1 text-sm ${!activeId ? "bg-black text-white" : "bg-gray-100"}`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className={`shrink-0 rounded-full px-4 py-1 text-sm ${activeId === c.id ? "bg-black text-white" : "bg-gray-100"}`}
        >
          {c.title}
        </button>
      ))}
    </div>
  );
}
