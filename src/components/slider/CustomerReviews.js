import { Fragment, useState } from "react";
import Slider from "react-slick";
const CustomerReviews = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const props = {
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 400,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (current, next) => setSlideIndex((next / 2) * 100),
  };
  return (
    <Fragment>
      <div className="feedback-content-area rmb-65 wow fadeInLeft delay-0-2s">
        <div className="section-title mb-50">
          <span className="sub-title mb-20">Customer Reviews</span>
          <h2>Valuable {`Customer’s`} Feedback (Reviews)</h2>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={50}
          style={{ backgroundSize: `${slideIndex}% 100%` }}
        >
          <span className="slider__label sr-only">50% completed</span>
        </div>

        <Slider {...props} className="feedback-active mt-20">
          <div className="feedback-item">
            <p>
              Because of mayaTek my family eats healthy now.
            </p>
            <div className="feedback-author">
              <img src="/assets/images/reviews/fb-author1.png" alt="Authro" />
              <div className="title">
                <h4>Henry K. Asante</h4>
                <span>Global &amp; Citizen</span>
              </div>
              <div className="ratting">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
            </div>
          </div>
          <div className="feedback-item">
            <p>
              You guys are indeed creating solutions for real problems.
            </p>
            <div className="feedback-author">
              <img src="/assets/images/reviews/fb-author1.png" alt="Authro" />
              <div className="title">
                <h4>W. A. Adu</h4>
                <span>Idea</span>
              </div>
              <div className="ratting">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
            </div>
          </div>
          <div className="feedback-item">
            <p>
              Exactly what I expected from a solution driven organization.
            </p>
            <div className="feedback-author">
              <img src="/assets/images/reviews/fb-author1.png" alt="Authro" />
              <div className="title">
                <h4>Judith</h4>
                <span>Dream</span>
              </div>
              <div className="ratting">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </Fragment>
  );
};
export default CustomerReviews;
