import { useEffect, useMemo, useState } from "react";

export const SORT_OPTIONS = [
  { value: "default", label: "Best Selling" },
  { value: "new", label: "Latest" },
  { value: "old", label: "Oldest" },
  { value: "high-to-low", label: "High To Low" },
  { value: "low-to-high", label: "Low To High" },
];

const priceOf = (product) =>
  Number(product.catalogue[0]?.price ?? product.price ?? 0);

const createdAtOf = (product) =>
  new Date(product.raw?.createdAt || product.raw?.created_at || 0).getTime();

const sortProducts = (products, sort) => {
  const sorted = [...products];

  switch (sort) {
    case "new":
      return sorted.sort((a, b) => createdAtOf(b) - createdAtOf(a));
    case "old":
      return sorted.sort((a, b) => createdAtOf(a) - createdAtOf(b));
    case "high-to-low":
      return sorted.sort((a, b) => priceOf(b) - priceOf(a));
    case "low-to-high":
      return sorted.sort((a, b) => priceOf(a) - priceOf(b));
    default:
      return sorted;
  }
};

const toCategoryList = (product) =>
  (Array.isArray(product.categories)
    ? product.categories
    : [product.categories]
  ).filter(Boolean);

/** Search, category, price and sort applied client-side over the full list. */
export const useProductCatalog = (products, { pageSize = 8 } = {}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState(null);
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const counts = new Map();

    products.forEach((product) => {
      toCategoryList(product).forEach((name) => {
        counts.set(name, (counts.get(name) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matches = products.filter((product) => {
      if (term) {
        const haystack =
          `${product.title} ${product.description}`.toLowerCase();
        if (!haystack.includes(term)) {
          return false;
        }
      }

      if (category && !toCategoryList(product).includes(category)) {
        return false;
      }

      if (priceRange) {
        const price = priceOf(product);
        if (price < priceRange.min || price > priceRange.max) {
          return false;
        }
      }

      return true;
    });

    return sortProducts(matches, sort);
  }, [category, priceRange, products, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Filtering can strip away the page the user is on.
  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setPriceRange(null);
    setSort("default");
    setPage(1);
  };

  return {
    categories,
    category,
    filtered,
    page,
    pageCount,
    paged,
    priceRange,
    resetFilters,
    search,
    setCategory: (value) => {
      setCategory(value);
      setPage(1);
    },
    setPage,
    setPriceRange: (value) => {
      setPriceRange(value);
      setPage(1);
    },
    setSearch: (value) => {
      setSearch(value);
      setPage(1);
    },
    setSort,
    sort,
    total: filtered.length,
  };
};

export default useProductCatalog;
