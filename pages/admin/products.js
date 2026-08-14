import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "../../src/components/admin/AdminLayout";
import DataTable from "../../src/components/admin/DataTable";
import {
  ErrorState,
  LoadingState,
} from "../../src/components/shop/StateMessage";
import { formatPrice } from "../../src/services/constants";
import { isSoldOut } from "../../src/services/normalizers";
import { getProducts } from "../../src/services/products";

const stockLabel = (product) => {
  const tracked = product.catalogue.filter((entry) => entry.stock !== null);

  if (!tracked.length) {
    return product.stock === null ? "Not tracked" : `${product.stock}`;
  }

  const total = tracked.reduce((sum, entry) => sum + Number(entry.stock), 0);
  return String(total);
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setProducts(await getProducts());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const columns = useMemo(
    () => [
      {
        key: "title",
        header: "Product",
        render: (product) => (
          <Link href={`/product/${product.id}`}>
            <a>{product.title}</a>
          </Link>
        ),
      },
      {
        key: "categories",
        header: "Category",
        value: (product) => (product.categories || []).join(", "),
        render: (product) => (product.categories || []).join(", ") || "—",
      },
      {
        key: "price",
        header: "Price",
        value: (product) =>
          Number(product.catalogue[0]?.price ?? product.price ?? 0),
        render: (product) =>
          formatPrice(product.catalogue[0]?.price ?? product.price ?? 0),
      },
      {
        key: "sizes",
        header: "Sizes",
        value: (product) => product.catalogue.length,
        render: (product) =>
          product.catalogue.length
            ? product.catalogue
                .map((entry) => entry.size || "Standard")
                .join(", ")
            : "—",
      },
      {
        key: "stock",
        header: "Stock",
        value: stockLabel,
        render: (product) => {
          const label = stockLabel(product);
          const soldOut =
            product.catalogue.length > 0 &&
            product.catalogue.every((entry) => isSoldOut(entry.stock));

          return (
            <span className={soldOut ? "text-danger" : ""}>
              {soldOut ? "Out of stock" : label}
            </span>
          );
        },
      },
      {
        key: "actions",
        header: "",
        sortable: false,
        render: (product) => (
          <Link href={`/farmer/products/${product.id}/edit`}>
            <a className="admin-link-btn">Edit</a>
          </Link>
        ),
      },
    ],
    []
  );

  return (
    <AdminLayout
      pageName="Products"
      subtitle="Every listing on the marketplace"
      icon="fas fa-carrot"
      actions={
        <Link href="/farmer/products/new">
          <a className="theme-btn style-two">
            Add listing <i className="fas fa-angle-double-right" />
          </a>
        </Link>
      }
    >

      {isLoading && <LoadingState message="Loading listings…" />}

      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && (
        <DataTable
          columns={columns}
          rows={products}
          searchPlaceholder="Search listings…"
          emptyTitle="No listings"
          emptyMessage="No products have been published yet."
        />
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
