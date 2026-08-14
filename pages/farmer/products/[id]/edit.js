import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import FarmerLayout from "../../../../src/components/farmer/FarmerLayout";
import ProductForm from "../../../../src/components/farmer/ProductForm";
import {
  ErrorState,
  LoadingState,
} from "../../../../src/components/shop/StateMessage";
import { updateProduct } from "../../../../src/services/partner";
import { getProduct } from "../../../../src/services/products";

const EditProduct = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      setProduct(await getProduct(id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (payload) => {
    await updateProduct(id, payload);
    router.push("/farmer/products");
  };

  return (
    <FarmerLayout
      pageName="Edit listing"
      subtitle="Update the details, prices or stock of this product"
      icon="fas fa-pen"
    >
      {isLoading && <LoadingState message="Loading listing…" />}

      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && product && (
        <>
          <h4 className="mb-25">Edit {product.title}</h4>
          <ProductForm
            mode="edit"
            product={product}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
          />
        </>
      )}
    </FarmerLayout>
  );
};

export default EditProduct;
