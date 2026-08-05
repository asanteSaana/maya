// Legacy route from the original template. Product pages now live at
// /product/[id]; this keeps any older link or bookmark working.
const ProductDetails = () => null;

export const getServerSideProps = async ({ query }) => ({
  redirect: {
    destination: query.id ? `/product/${query.id}` : "/shop-grid",
    permanent: false,
  },
});

export default ProductDetails;
