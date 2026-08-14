import { useRouter } from "next/router";
import FarmerLayout from "../../../src/components/farmer/FarmerLayout";
import ProductForm from "../../../src/components/farmer/ProductForm";
import { createProduct } from "../../../src/services/partner";

const NewProduct = () => {
  const router = useRouter();

  const handleSubmit = async (payload) => {
    await createProduct(payload);
    router.push("/farmer/products");
  };

  return (
    <FarmerLayout
      pageName="Add listing"
      subtitle="Publish produce for customers to buy"
      icon="fas fa-plus-circle"
    >
      <h4 className="mb-25">New listing</h4>
      <ProductForm
        mode="create"
        onSubmit={handleSubmit}
        submitLabel="Create listing"
      />
    </FarmerLayout>
  );
};

export default NewProduct;
