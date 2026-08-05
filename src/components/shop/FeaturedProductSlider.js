import Slider from "react-slick";
import useProducts from "../../hooks/useProducts";
import ProductCard from "./ProductCard";
import { ErrorState, LoadingState, SignInPrompt } from "./StateMessage";

/**
 * Homepage product carousel. Fetches on the client so a cold backend delays
 * this section rather than the whole page.
 */
const FeaturedProductSlider = ({
  sliderProps,
  className = "product-active",
  limit = 10,
}) => {
  const { products, isLoading, error, requiresAuth, refresh } = useProducts();

  if (isLoading) {
    return <LoadingState />;
  }

  if (requiresAuth) {
    return <SignInPrompt message="Sign in to see what our farmers are selling." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  if (!products.length) {
    return null;
  }

  const featured = products.slice(0, limit);

  // react-slick misbehaves when it has fewer children than slidesToShow, so
  // small catalogues render as a plain row instead.
  if (featured.length < 3) {
    return (
      <div className="row justify-content-center">
        {featured.map((product, index) => (
          <div className="col-lg-4 col-sm-6" key={product.id}>
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Slider {...sliderProps} className={className}>
      {featured.map((product, index) => (
        <ProductCard product={product} index={index} key={product.id} />
      ))}
    </Slider>
  );
};

export default FeaturedProductSlider;
