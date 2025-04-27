import Link from "next/link";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <Button
        asChild
        variant={!selectedCategory ? "default" : "outline"}
        className="w-full justify-start"
      >
        <Link href="/products">All Categories</Link>
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          asChild
          variant={selectedCategory === category.id ? "default" : "outline"}
          className="w-full justify-start"
        >
          <Link href={`/products?category=${category.id}`}>
            {category.name}
          </Link>
        </Button>
      ))}
    </div>
  );
}
