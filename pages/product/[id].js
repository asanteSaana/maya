import Link from "next/link";
import { useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import Slider from "react-slick";
import PageBanner from "../../src/components/PageBanner";
import ProductCard from "../../src/components/shop/ProductCard";
import { SignInPrompt } from "../../src/components/shop/StateMessage";
import { useCart } from "../../src/context/CartContext";
import { useWishlist } from "../../src/context/WishlistContext";
import Layout from "../../src/layout/Layout";
import { formatPrice } from "../../src/services/constants";
import { isSoldOut } from "../../src/services/normalizers";
import {
  loadProduct,
  loadProducts,
  serializable,
} from "../../src/services/serverProducts";
import { productActiveTwo } from "../../src/sliderProps";

const ProductDetails = ({ product, related, error, requiresAuth }) => {
  const { addItem } = useCart();
  const { has, toggleItem } = useWishlist();
  const [catalogueId, setCatalogueId] = useState(
    product?.catalogue[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");

  if (requiresAuth) {
    return (
      <Layout title="Product">
        <PageBanner pageName={"Product Details"} compact />
        <div className="container py-130 rpy-100">
          <SignInPrompt message="Sign in to view this product." />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout title="Product">
        <PageBanner pageName={"Product Details"} compact />
        <div className="container py-130 rpy-100 text-center">
          <h4>{error ? "Something went wrong" : "Product not found"}</h4>
          <p>
            {error || "This product may have been removed by the farmer."}
          </p>
          <Link href="/products">
            <a className="theme-btn style-two">
              Back to shop <i className="fas fa-angle-double-right" />
            </a>
          </Link>
        </div>
      </Layout>
    );
  }

  const selected =
    product.catalogue.find((entry) => entry.id === catalogueId) ||
    product.catalogue[0] ||
    {};
  const price = Number(selected.price || product.price || 0);
  const stock = selected.stock ?? product.stock ?? null;
  const soldOut = isSoldOut(stock);
  const categories = Array.isArray(product.categories)
    ? product.categories
    : [product.categories].filter(Boolean);

  const handleAddToCart = (event) => {
    event.preventDefault();
    addItem(product, quantity, selected);
    setFeedback(`${quantity} × ${product.title} added to your cart.`);
  };

  return (
    <Layout
      title={product.title}
      description={product.description || `Buy ${product.title} direct from the farmer on Maya.`}
    >
      <PageBanner pageName={product.title} compact />
      <section className="product-details-area pt-130 rpt-100">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-lg-6">
              <div className="product-preview-images rmb-55 wow fadeInLeft delay-0-2s">
                <a href={product.image}>
                  <img src={product.image} alt={product.title} />
                </a>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6">
              <div className="product-details-content mb-30 wow fadeInRight delay-0-2s">
                <div className="off-ratting mb-15">
                  {soldOut && <span className="off bg-red">Sold out</span>}
                  <div className="ratting">
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                  </div>
                </div>
                <div className="section-title mb-20">
                  <h2>{product.title}</h2>
                </div>
                <p>{product.description || "No description provided."}</p>
                <span className="price mb-20">{formatPrice(price)}</span>
                <hr />

                {product.catalogue.length > 1 && (
                  <div className="form-group">
                    <label htmlFor="catalogue">Size</label>
                    <select
                      id="catalogue"
                      className="form-control"
                      value={selected.id}
                      onChange={(event) => setCatalogueId(event.target.value)}
                    >
                      {product.catalogue.map((entry) => (
                        <option value={entry.id} key={entry.id}>
                          {entry.size || "Standard"} — {formatPrice(entry.price)}
                          {isSoldOut(entry.stock) ? " (sold out)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <p className="mb-10">
                  {soldOut ? (
                    <strong className="stock text-danger">Out of stock</strong>
                  ) : (
                    <strong className="stock">
                      {stock === null ? "In stock" : `${stock} in stock`}
                    </strong>
                  )}
                </p>

                <form onSubmit={handleAddToCart} className="add-to-cart mt-40 mb-40">
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    max={stock === null ? undefined : Math.max(1, stock)}
                    onChange={(event) =>
                      setQuantity(
                        Math.max(1, Number(event.target.value || 1))
                      )
                    }
                    required
                  />
                  <button
                    type="submit"
                    className="theme-btn"
                    disabled={soldOut}
                  >
                    Add to Cart <i className="fas fa-angle-double-right" />
                  </button>
                </form>

                {feedback && (
                  <div className="alert alert-success" role="status">
                    {feedback}{" "}
                    <Link href="/cart">
                      <a>View cart</a>
                    </Link>
                  </div>
                )}

                <button
                  type="button"
                  className="theme-btn style-two mb-30"
                  onClick={() => toggleItem(product)}
                >
                  {has(product.id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}{" "}
                  <i className={`${has(product.id) ? "fas" : "far"} fa-heart`} />
                </button>

                <hr />
                <ul className="category-tags pt-10">
                  <li>
                    <b>Category</b>
                    <span>:</span>
                    {categories.length ? (
                      categories.map((name) => (
                        <Link href="/products" key={name}>
                          <a>{name}</a>
                        </Link>
                      ))
                    ) : (
                      <span>Uncategorised</span>
                    )}
                  </li>
                  {product.color && (
                    <li>
                      <b>Colour</b>
                      <span>:</span>
                      <span>{product.color}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <Tab.Container defaultActiveKey={"details"}>
            <Nav className="nav nav-tabs product-information-tab pt-35 mb-25">
              <li>
                <Nav.Link eventKey={"details"} href="#details" data-toggle="tab">
                  Description
                </Nav.Link>
              </li>
              <li>
                <Nav.Link
                  eventKey={"information"}
                  href="#information"
                  data-toggle="tab"
                >
                  Additional information
                </Nav.Link>
              </li>
            </Nav>
            <Tab.Content className="tab-content wow fadeInUp delay-0-2s">
              <Tab.Pane className="tab-pane" eventKey="details">
                <p>{product.description || "No description provided."}</p>
              </Tab.Pane>
              <Tab.Pane className="tab-pane" eventKey="information">
                <ul className="list-style-one mt-25 mb-25">
                  {product.catalogue.map((entry) => (
                    <li key={entry.id}>
                      {entry.size || "Standard"} — {formatPrice(entry.price)}
                      {entry.stock === null ? "" : ` (${entry.stock} in stock)`}
                    </li>
                  ))}
                  {product.color && <li>Colour: {product.color}</li>}
                  {categories.length > 0 && (
                    <li>Category: {categories.join(", ")}</li>
                  )}
                </ul>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </section>

      {related.length > 0 && (
        <section className="related-product-area pt-115 rpt-85 pb-130 rpb-100">
          <div className="container">
            <div className="section-title text-center mb-55">
              <h2>Related Products</h2>
            </div>
            <Slider {...productActiveTwo} className="related-product-active">
              {related.map((item, index) => (
                <ProductCard product={item} index={index} key={item.id} />
              ))}
            </Slider>
          </div>
        </section>
      )}
    </Layout>
  );
};

export const getServerSideProps = async ({ req, params }) => {
  const { product, error, requiresAuth, notFound } = await loadProduct(
    req,
    params.id
  );

  if (notFound) {
    return { notFound: true };
  }

  // Related products share a category with this one; a failure here should not
  // take down the page, so an empty list is an acceptable outcome.
  let related = [];

  if (product) {
    const { products } = await loadProducts(req);
    const categories = Array.isArray(product.categories)
      ? product.categories
      : [product.categories].filter(Boolean);

    related = products
      .filter((item) => item.id !== product.id)
      .filter((item) => {
        if (!categories.length) {
          return true;
        }

        const itemCategories = Array.isArray(item.categories)
          ? item.categories
          : [item.categories].filter(Boolean);

        return itemCategories.some((name) => categories.includes(name));
      })
      .slice(0, 8);
  }

  return {
    props: {
      product: serializable(product),
      related: serializable(related),
      error: error || "",
      requiresAuth: Boolean(requiresAuth),
    },
  };
};

export default ProductDetails;
