import Link from "next/link";
import { useMemo } from "react";
import { useProducts } from "../../hooks/useProducts";
import { categoryKey } from "../../services/normalizers";

// The template shipped five invented categories — "Sea Fish's", "Crisp Bakery",
// "Chiken Egg" — none of which exist in the catalogue. These are derived from
// what farmers have actually listed, so the strip can never advertise a
// category with nothing behind it.
const ICONS = [
  "fas fa-apple-alt",
  "fas fa-carrot",
  "fas fa-seedling",
  "fas fa-bread-slice",
  "fas fa-egg",
  "fas fa-fish",
  "fas fa-lemon",
  "fas fa-pepper-hot",
];

const CategoryStrip = ({ limit = 6 }) => {
  const { products, isLoading } = useProducts();

  const categories = useMemo(() => {
    const groups = new Map();

    products.forEach((product) => {
      (product.categories || []).forEach((name) => {
        const key = categoryKey(name);
        if (!key) {
          return;
        }
        const group = groups.get(key) || { key, count: 0, labels: new Map() };
        group.count += 1;
        group.labels.set(name, (group.labels.get(name) || 0) + 1);
        groups.set(key, group);
      });
    });

    return Array.from(groups.values())
      .map((group) => ({
        key: group.key,
        count: group.count,
        // Categories are spelled inconsistently in the data; show the most
        // common spelling rather than whichever happened to load first.
        name: Array.from(group.labels.entries()).sort(
          (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
        )[0][0],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [products, limit]);

  if (isLoading || categories.length === 0) {
    return null;
  }

  return (
    <div className="category-wrap">
      {categories.map((category, index) => (
        <div
          className={`category-item wow fadeInUp delay-0-${(index % 5) + 3}s`}
          key={category.key}
        >
          <div className="icon">
            <i className={ICONS[index % ICONS.length]} aria-hidden="true" />
          </div>
          <h5>
            <Link href={`/products?category=${encodeURIComponent(category.key)}`}>
              {category.name}
            </Link>
          </h5>
          <span className="category-count">
            {category.count} {category.count === 1 ? "item" : "items"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategoryStrip;
