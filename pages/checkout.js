import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import FormAlert from "../src/components/FormAlert";
import PageBanner from "../src/components/PageBanner";
import { EmptyState, LoadingState } from "../src/components/shop/StateMessage";
import { useAuth } from "../src/context/AuthContext";
import { useCart } from "../src/context/CartContext";
import Layout from "../src/layout/Layout";
import { formatPrice } from "../src/services/constants";
import { createOrder } from "../src/services/orders";

const EMPTY_ADDRESS = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  country: "",
  city: "",
  state: "",
  zip: "",
  street: "",
  apartment: "",
  notes: "",
};

const Checkout = () => {
  const router = useRouter();
  const { isAuthenticated, isReady: authReady, login, user } = useAuth();
  const {
    clearCart,
    isReady: cartReady,
    items,
    shipping,
    subTotal,
    totalPrice,
    vat,
  } = useCart();

  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [orderError, setOrderError] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setAddress((current) => ({
        ...current,
        email: current.email || user.email,
      }));
    }
  }, [user]);

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  };

  const handleInlineLogin = async (event) => {
    event.preventDefault();
    setLoginError("");

    try {
      await login(credentials);
    } catch (requestError) {
      setLoginError(requestError.message);
    }
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    setOrderError("");
    setIsPlacing(true);

    try {
      const orders = await createOrder({
        items,
        // The documented address schema is { city }. The rest of the billing
        // form rides along and is kept if the backend's schema accepts it.
        address: {
          city: address.city,
          state: address.state,
          country: address.country,
          zip: address.zip,
          street: address.street,
          apartment: address.apartment,
          phone: address.phone,
          recipient: `${address.firstName} ${address.lastName}`.trim(),
          notes: address.notes,
        },
      });

      clearCart();

      // Each basket line becomes its own order, so a multi-item basket has no
      // single order to land on.
      router.push(
        orders.length === 1 && orders[0].id
          ? `/orders/${orders[0].id}`
          : "/orders"
      );
    } catch (requestError) {
      setOrderError(
        requestError.partial
          ? `${requestError.message} Some items may still have been ordered — check your orders before trying again.`
          : requestError.message
      );
      setIsPlacing(false);
    }
  };

  if (!cartReady || !authReady) {
    return (
      <Layout>
        <PageBanner pageName={"Checkout"} />
        <div className="container py-130 rpy-100">
          <LoadingState message="Preparing your checkout…" />
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <PageBanner pageName={"Checkout"} />
        <div className="container py-130 rpy-100">
          <EmptyState
            title="Your cart is empty"
            message="Add a few items before checking out."
            action={
              <Link href="/products">
                <a className="theme-btn style-two">
                  Start shopping <i className="fas fa-angle-double-right" />
                </a>
              </Link>
            }
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageBanner pageName={"Checkout"} />
      <div className="checkout-form-area py-130 rpy-100">
        <div className="container">
          {!isAuthenticated && (
            <Accordion
              className="checkout-faqs wow fadeInUp delay-0-2s"
              id="checkout-faqs"
            >
              <div className="alert bg-lighter">
                <h6>
                  Returning customer?{" "}
                  <Accordion.Toggle
                    as={"a"}
                    className="collapsed card-header c-cursor"
                    eventKey="collapse0"
                  >
                    Click here to login
                  </Accordion.Toggle>
                </h6>
                <Accordion.Collapse eventKey="collapse0" className="content">
                  <form onSubmit={handleInlineLogin}>
                    <p>Sign in to place your order.</p>
                    <FormAlert error={loginError} />
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Your Email Address"
                            value={credentials.email}
                            onChange={(event) =>
                              setCredentials((current) => ({
                                ...current,
                                email: event.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Your Password"
                            value={credentials.password}
                            onChange={(event) =>
                              setCredentials((current) => ({
                                ...current,
                                password: event.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-footer">
                      <button type="submit" className="theme-btn style-two">
                        login <i className="fas fa-angle-double-right" />
                      </button>
                    </div>
                    <p className="pt-15 mb-0">
                      No account yet?{" "}
                      <Link href="/register">
                        <a>Create one</a>
                      </Link>
                    </p>
                  </form>
                </Accordion.Collapse>
              </div>
            </Accordion>
          )}

          <form onSubmit={handlePlaceOrder}>
            <div className="row pt-25">
              <div className="col-lg-7">
                <div className="checkout-billing-details wow fadeInUp delay-0-2s">
                  <h4 className="form-title mb-25">Billing Details</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="firstName"
                          className="form-control"
                          placeholder="First Name"
                          value={address.firstName}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="lastName"
                          className="form-control"
                          placeholder="Last Name"
                          value={address.lastName}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          placeholder="Phone Number"
                          value={address.phone}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Email Address"
                          value={address.email}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <h6>Your Address</h6>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="city"
                          className="form-control"
                          placeholder="City"
                          value={address.city}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="state"
                          className="form-control"
                          placeholder="State / Region"
                          value={address.state}
                          onChange={handleAddressChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="country"
                          className="form-control"
                          placeholder="Country"
                          value={address.country}
                          onChange={handleAddressChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="zip"
                          className="form-control"
                          placeholder="Zip / Postal Code"
                          value={address.zip}
                          onChange={handleAddressChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="street"
                          className="form-control"
                          placeholder="House, street name"
                          value={address.street}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          name="apartment"
                          className="form-control"
                          placeholder="Apartment, suite, unit etc. (optional)"
                          value={address.apartment}
                          onChange={handleAddressChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <h6>Order Notes (optional)</h6>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group mb-0">
                        <textarea
                          name="notes"
                          className="form-control"
                          rows={4}
                          placeholder="Notes about your order, e.g. special delivery instructions"
                          value={address.notes}
                          onChange={handleAddressChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="shoping-cart-total mt-0 wow fadeInUp delay-0-4s">
                  <h4 className="form-title mb-25">Your Order</h4>
                  <table>
                    <tbody>
                      {items.map((item) => (
                        <tr key={`${item.productId}:${item.catalogueId}`}>
                          <td>
                            {item.title}
                            {item.size ? ` (${item.size})` : ""} ×{" "}
                            {item.quantity}
                          </td>
                          <td>{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
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

                  <div className="pt-25">
                    <FormAlert error={orderError} />
                    {orderError && (
                      <p className="mb-15">
                        <Link href="/orders">
                          <a>Check your orders</a>
                        </Link>{" "}
                        before placing this again.
                      </p>
                    )}
                    <button
                      type="submit"
                      className="theme-btn style-two w-100"
                      disabled={isPlacing}
                    >
                      {isPlacing
                        ? "Placing your order…"
                        : isAuthenticated
                        ? "Place Order"
                        : "Sign in to Place Order"}
                      <i className="fas fa-angle-double-right" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
