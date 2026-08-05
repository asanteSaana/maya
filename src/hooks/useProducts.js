import { useCallback, useEffect, useMemo, useState } from "react";
import { getProducts } from "../services/products";

/**
 * Client-side product loader. `initialProducts` lets a page seed itself from
 * getServerSideProps and skip the initial fetch entirely.
 */
export const useProducts = ({
  initialProducts = null,
  initialError = "",
  initialRequiresAuth = false,
} = {}) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [isLoading, setIsLoading] = useState(!initialProducts && !initialError);
  const [error, setError] = useState(initialError);
  const [requiresAuth, setRequiresAuth] = useState(initialRequiresAuth);

  const load = useCallback(async (signal) => {
    setIsLoading(true);
    setError("");
    setRequiresAuth(false);

    try {
      const result = await getProducts({ signal });
      setProducts(result);
    } catch (requestError) {
      if (requestError.name === "AbortError") {
        return;
      }

      // A 401 means the catalogue is gated rather than unavailable.
      if (requestError.status === 401 || requestError.status === 403) {
        setRequiresAuth(true);
      } else {
        setError(requestError.message);
      }

      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialProducts || initialError || initialRequiresAuth) {
      return undefined;
    }

    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [initialError, initialProducts, initialRequiresAuth, load]);

  return useMemo(
    () => ({
      error,
      isLoading,
      products,
      refresh: () => load(),
      requiresAuth,
    }),
    [error, isLoading, load, products, requiresAuth]
  );
};

export default useProducts;
