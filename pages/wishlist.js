import Link from "next/link";
import ClientLogoSlider from "../src/components/ClientLogoSlider";
import PageBanner from "../src/components/PageBanner";
import { EmptyState, LoadingState } from "../src/components/shop/StateMessage";
import { useCart } from "../src/context/CartContext";
import { useWishlist } from "../src/context/WishlistContext";
import Layout from "../src/layout/Layout";
import { formatPrice } from "../src/services/constants";

const WishlistPage = () => {
  const { addItem } = useCart();
  const { isReady, items, removeItem } = useWishlist();

  const handleAddToCart = (item) => {
    // Wishlist rows store the flat product summary the cart already understands.
    addItem(item, 1, {
      id: item.catalogueId,
      price: item.price,
      size: item.size,
    });
    removeItem(item.productId);
  };

  return (
    <Layout>
      <PageBanner pageName={"Wishlist Page"} />
      <div className="wishlist-area py-130 rpy-100">
        <div className="container">
          {!isReady && <LoadingState message="Loading your wishlist…" />}

          {isReady && items.length === 0 && (
            <EmptyState
              title="Your wishlist is empty"
              message="Tap the heart on any product to save it for later."
              action={
                <Link href="/products">
                  <a className="theme-btn style-two">
                    Browse products <i className="fas fa-angle-double-right" />
                  </a>
                </Link>
              }
            />
          )}

          {isReady && items.length > 0 && (
            <div className="cart-item-wrap wow fadeInUp delay-0-2s">
              {items.map((item) => (
                <div className="cart-single-item" key={item.productId}>
                  <button
                    type="button"
                    className="close"
                    aria-label={`Remove ${item.title}`}
                    onClick={() => removeItem(item.productId)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <div className="cart-img">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <h5 className="product-name">
                    <Link href={`/product/${item.productId}`}>
                      {item.title}
                    </Link>
                  </h5>
                  <span className="product-price">
                    {formatPrice(item.price)}
                  </span>
                  <strong className="stock">
                    {item.stock > 0 ? "In Stock" : "Out of Stock"}
                  </strong>
                  <button
                    type="button"
                    className="theme-btn style-two"
                    disabled={item.stock <= 0}
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Wishlist Area End */}
      {/* Client Logo Section Start */}
      <div className="client-logo-section text-center bg-light-green py-60">
        <div className="container">
          <ClientLogoSlider />
        </div>
        <div className="client-logo-shapes">
          <img
            className="shape-one"
            src="assets/images/shapes/cl-shape1.png"
            alt="Shape"
          />
          <img
            className="shape-two"
            src="assets/images/shapes/cl-shape2.png"
            alt="Shape"
          />
          <img
            className="shape-three"
            src="assets/images/shapes/cl-shape3.png"
            alt="Shape"
          />
          <img
            className="shape-four"
            src="assets/images/shapes/cl-shape4.png"
            alt="Shape"
          />
          <img
            className="shape-five"
            src="assets/images/shapes/cl-shape5.png"
            alt="Shape"
          />
          <img
            className="shape-six"
            src="assets/images/shapes/cl-shape6.png"
            alt="Shape"
          />
        </div>
      </div>
    </Layout>
  );
};
export default WishlistPage;
