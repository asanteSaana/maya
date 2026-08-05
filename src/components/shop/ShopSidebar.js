import Link from "next/link";
import { formatPrice } from "../../services/constants";

// Price bands are fixed buckets rather than derived from the data, so the
// widget stays stable as stock comes and goes.
const PRICE_RANGES = [
  { label: "Under 10", min: 0, max: 10 },
  { label: "10 – 25", min: 10, max: 25 },
  { label: "25 – 50", min: 25, max: 50 },
  { label: "50 – 100", min: 50, max: 100 },
  { label: "Over 100", min: 100, max: Infinity },
];

const isSameRange = (a, b) => a && b && a.min === b.min && a.max === b.max;

const ShopSidebar = ({ catalog, products }) => {
  const bestSellers = products.slice(0, 4);

  return (
    <div className="shop-sidebar mt-65">
      <div className="widget widget-search wow fadeInUp delay-0-2s">
        <form onSubmit={(event) => event.preventDefault()}>
          <input
            type="text"
            placeholder="Search keywords"
            value={catalog.search}
            onChange={(event) => catalog.setSearch(event.target.value)}
          />
          <button type="submit" className="searchbutton fa fa-search" />
        </form>
      </div>

      <div className="widget widget-menu wow fadeInUp delay-0-4s">
        <h4 className="widget-title">
          <i className="flaticon-leaf-1" />
          Category
        </h4>
        <ul>
          <li>
            <a
              href="#"
              className={catalog.category ? "" : "active"}
              onClick={(event) => {
                event.preventDefault();
                catalog.setCategory("");
              }}
            >
              All Products
            </a>{" "}
            <span>({products.length})</span>
          </li>
          {catalog.categories.map((entry) => (
            <li key={entry.key}>
              <a
                href="#"
                className={catalog.category === entry.key ? "active" : ""}
                onClick={(event) => {
                  event.preventDefault();
                  catalog.setCategory(
                    catalog.category === entry.key ? "" : entry.key
                  );
                }}
              >
                {entry.name}
              </a>{" "}
              <span>({entry.count})</span>
            </li>
          ))}
          {!catalog.categories.length && (
            <li>
              <span>No categories yet</span>
            </li>
          )}
        </ul>
      </div>

      <div className="widget widget-menu wow fadeInUp delay-0-2s">
        <h4 className="widget-title">
          <i className="flaticon-leaf-1" />
          Filter By Pricing
        </h4>
        <ul>
          {PRICE_RANGES.map((range) => {
            const count = products.filter((product) => {
              const price = Number(
                product.catalogue[0]?.price ?? product.price ?? 0
              );
              return price >= range.min && price <= range.max;
            }).length;

            return (
              <li key={range.label}>
                <a
                  href="#"
                  className={
                    isSameRange(catalog.priceRange, range) ? "active" : ""
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    catalog.setPriceRange(
                      isSameRange(catalog.priceRange, range) ? null : range
                    );
                  }}
                >
                  {range.label}
                </a>{" "}
                <span>({count})</span>
              </li>
            );
          })}
        </ul>
      </div>

      {bestSellers.length > 0 && (
        <div className="widget widget-products wow fadeInUp delay-0-2s">
          <h4 className="widget-title">
            <i className="flaticon-leaf-1" />
            Best Seller
          </h4>
          <ul>
            {bestSellers.map((product) => (
              <li key={product.id}>
                <div className="image">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="content">
                  <div className="ratting">
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                  </div>
                  <h5>
                    <Link href={`/product/${product.id}`}>{product.title}</Link>
                  </h5>
                  <span className="price">
                    {formatPrice(
                      product.catalogue[0]?.price ?? product.price ?? 0
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {catalog.categories.length > 0 && (
        <div className="widget widget-tag-cloud wow fadeInUp delay-0-2s">
          <h4 className="widget-title">
            <i className="flaticon-leaf-1" />
            Popular Tags
          </h4>
          <div className="tag-coulds">
            {catalog.categories.slice(0, 8).map((entry) => (
              <a
                href="#"
                key={entry.key}
                onClick={(event) => {
                  event.preventDefault();
                  catalog.setCategory(entry.key);
                }}
              >
                {entry.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopSidebar;
