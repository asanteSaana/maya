import Isotope from "isotope-layout";
import { Fragment, useEffect, useRef, useState } from "react";
import ProductCard from "../shop/ProductCard";
import { ErrorState, LoadingState, SignInPrompt } from "../shop/StateMessage";
import useProducts from "../../hooks/useProducts";

// Isotope filters on CSS classes, so category names become class-safe slugs.
const toSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const categoriesOf = (product) =>
  (Array.isArray(product.categories)
    ? product.categories
    : [product.categories]
  ).filter(Boolean);

/**
 * Shared body for the Trendy/Popular product sections. Filter buttons are built
 * from the categories that actually exist in the catalogue rather than the
 * template's hardcoded list.
 */
const FilterableProducts = ({ subTitle, title, gridClass, limit = 8 }) => {
  const { products, isLoading, error, requiresAuth, refresh } = useProducts();
  const isotope = useRef(null);
  const [filterKey, setFilterKey] = useState("*");

  const featured = products.slice(0, limit);

  const filters = Array.from(
    new Set(featured.flatMap((product) => categoriesOf(product)))
  ).slice(0, 5);

  // Isotope must be (re)initialised once the products are in the DOM.
  useEffect(() => {
    if (!featured.length) {
      return undefined;
    }

    const timer = setTimeout(() => {
      isotope.current = new Isotope(`.${gridClass}`, {
        itemSelector: ".item",
        percentPosition: true,
        masonry: { columnWidth: ".item" },
        animationOptions: { duration: 750, easing: "linear", queue: false },
      });
    }, 300);

    return () => {
      clearTimeout(timer);

      if (isotope.current) {
        isotope.current.destroy();
        isotope.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridClass, featured.length]);

  useEffect(() => {
    if (isotope.current) {
      isotope.current.arrange({
        filter: filterKey === "*" ? "*" : `.${filterKey}`,
      });
    }
  }, [filterKey]);

  const activeBtn = (value) => (value === filterKey ? "current" : "");

  const renderBody = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (requiresAuth) {
      return <SignInPrompt message="Sign in to browse our farmers' produce." />;
    }

    if (error) {
      return <ErrorState message={error} onRetry={refresh} />;
    }

    if (!featured.length) {
      return null;
    }

    return (
      <div className={`row ${gridClass}`}>
        {featured.map((product, index) => (
          <div
            className={`col-xl-3 col-lg-4 col-sm-6 item ${categoriesOf(product)
              .map(toSlug)
              .join(" ")}`}
            key={product.id}
          >
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Fragment>
      <div className="row align-items-center pb-30">
        <div className="col-lg-6 wow fadeInUp delay-0-2s">
          <div className="section-title mb-20">
            <span className="sub-title mb-20">{subTitle}</span>
            <h2>{title}</h2>
          </div>
        </div>
        {filters.length > 1 && (
          <div className="col-lg-6 text-lg-right wow fadeInUp delay-0-4s">
            <ul className={`${gridClass}-filter filter-btns-one mb-20`}>
              <li
                className={`c-pointer ${activeBtn("*")}`}
                onClick={() => setFilterKey("*")}
              >
                Show All
              </li>
              {filters.map((name) => (
                <li
                  key={name}
                  className={`c-pointer ${activeBtn(toSlug(name))}`}
                  onClick={() => setFilterKey(toSlug(name))}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {renderBody()}
    </Fragment>
  );
};

export default FilterableProducts;
