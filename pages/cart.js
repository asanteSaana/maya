import Link from "next/link";
import ClientLogoSlider from "../src/components/ClientLogoSlider";
import PageBanner from "../src/components/PageBanner";
import { EmptyState, LoadingState } from "../src/components/shop/StateMessage";
import { useCart } from "../src/context/CartContext";
import Layout from "../src/layout/Layout";
import { formatPrice } from "../src/services/constants";

const CartPage = () => {
  const {
    error,
    getItemKey,
    isReady,
    isSyncing,
    items,
    removeItem,
    shipping,
    subTotal,
    totalPrice,
    updateQuantity,
    vat,
  } = useCart();

  return (
    <Layout>
      <PageBanner pageName={"Cart Page"} />
      <div className="cart-area py-130 rpy-100">
        <div className="container">
          {error && (
            <div className="alert alert-warning" role="alert">
              {error}
            </div>
          )}

          {!isReady && <LoadingState message="Loading your cart…" />}

          {isReady && items.length === 0 && (
            <EmptyState
              title="Your cart is empty"
              message="Browse the marketplace and add something fresh."
              action={
                <Link href="/products">
                  <a className="theme-btn style-two">
                    Start shopping <i className="fas fa-angle-double-right" />
                  </a>
                </Link>
              }
            />
          )}

          {isReady && items.length > 0 && (
            <>
              <div className="cart-item-wrap mb-35 wow fadeInUp delay-0-2s">
                {items.map((item) => {
                  const itemKey = getItemKey(item);

                  return (
                    <div className="cart-single-item" key={itemKey}>
                      <button
                        type="button"
                        className="close"
                        aria-label={`Remove ${item.title}`}
                        onClick={() => removeItem(itemKey)}
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
                        {item.size && (
                          <small className="d-block">{item.size}</small>
                        )}
                      </h5>
                      <span className="product-price">
                        {formatPrice(item.price)}
                      </span>
                      <div className="quantity-input">
                        <button
                          type="button"
                          className="quantity-down"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(itemKey, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <input
                          className="quantity"
                          type="text"
                          value={item.quantity}
                          name="quantity"
                          onChange={(event) =>
                            updateQuantity(itemKey, event.target.value)
                          }
                        />
                        <button
                          type="button"
                          className="quantity-up"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(itemKey, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <span className="product-total-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="row text-center text-lg-left align-items-center wow fadeInUp delay-0-2s">
                <div className="col-lg-6">
                  <div className="discount-wrapper rmb-30">
                    {isSyncing && (
                      <p className="mb-0">
                        <i className="fas fa-spinner fa-spin" /> Saving your
                        cart…
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="update-shopping text-lg-right">
                    <Link href="/products">
                      <a className="theme-btn style-two">
                        Continue shopping{" "}
                        <i className="fas fa-angle-double-right" />
                      </a>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="payment-cart-total pt-25 wow fadeInUp delay-0-2s">
                <div className="row justify-content-end">
                  <div className="col-lg-5">
                    <div className="shoping-cart-total mt-45">
                      <h4 className="form-title m-25">Cart Totals</h4>
                      <table>
                        <tbody>
                          <tr>
                            <td>Cart Subtotal</td>
                            <td className="sub-total-price">
                              {formatPrice(subTotal)}
                            </td>
                          </tr>
                          <tr>
                            <td>Shipping Fee</td>
                            <td className="shipping-price">
                              {formatPrice(shipping)}
                            </td>
                          </tr>
                          <tr>
                            <td>Vat</td>
                            <td>{formatPrice(vat)}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Order Total</strong>
                            </td>
                            <td>
                              <strong className="total-price">
                                {formatPrice(totalPrice)}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <Link href="/checkout">
                        <a className="theme-btn style-two mt-25 w-100">
                          Proceed to checkout
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Cart Area End */}
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
export default CartPage;
