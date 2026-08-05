import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatPrice } from "../../services/constants";

// The template staggers card animations across a four-step cycle.
const DELAYS = ["delay-0-2s", "delay-0-4s", "delay-0-6s", "delay-0-8s"];

const ProductCard = ({ product, index = 0 }) => {
  const { addItem } = useCart();
  const { has, toggleItem } = useWishlist();

  const catalogue = product.catalogue[0] || {};
  const price = Number(catalogue.price || product.price || 0);
  const stock = Number(catalogue.stock ?? product.stock ?? 0);
  const isWishlisted = has(product.id);

  return (
    <div className={`product-item wow fadeInUp ${DELAYS[index % DELAYS.length]}`}>
      {stock <= 0 && <span className="offer bg-red">Sold out</span>}
      <div className="image">
        <Link href={`/product/${product.id}`}>
          <a>
            <img src={product.image} alt={product.title} />
          </a>
        </Link>
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
          <span>{formatPrice(price)}</span>
        </span>
        <div className="product-actions pt-10">
          <button
            type="button"
            className="theme-btn style-two"
            disabled={stock <= 0}
            onClick={() => addItem(product, 1, catalogue)}
          >
            {stock > 0 ? "Add to Cart" : "Sold Out"}
          </button>
          <button
            type="button"
            className="wishlist-toggle ml-10"
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            aria-pressed={isWishlisted}
            onClick={() => toggleItem(product)}
          >
            <i className={`${isWishlisted ? "fas" : "far"} fa-heart`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
