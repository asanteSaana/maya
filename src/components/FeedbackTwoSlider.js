import Slider from "react-slick";
import { feedbackTwoActive } from "../sliderProps";
const FeedbackTwoSlider = () => {
  return (
    <Slider {...feedbackTwoActive} className="feedback-two-active mt-20">
      <div className="feedback-item style-two wow fadeInUp delay-0-2s">
        <div className="content-image">
          <p>
            I get my vegetables the day after they are picked now. The difference in how long they keep is obvious, and I know which farm each one came from.
          </p>
          <div className="image">
            <img
              src="/assets/images/reviews/feedback-author1.jpg"
              alt="Reviewer"
            />
            <img
              className="bg"
              src="/assets/images/reviews/feedback-author-bg.png"
              alt="Background"
            />
          </div>
        </div>
        <div className="feedback-author">
          <div className="icon">
            <i className="flaticon-quote" />
          </div>
          <div className="title">
            <h4>Ama Boateng</h4>
            <span>Customer, Accra</span>
          </div>
          <div className="ratting">
            <h6>Verified purchase</h6>
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
          </div>
        </div>
      </div>
      <div className="feedback-item style-two wow fadeInUp delay-0-4s">
        <div className="content-image">
          <p>
            Selling here means I set my own price instead of taking whatever the aggregator offers. I have kept far more of what my harvest is actually worth.
          </p>
          <div className="image">
            <img
              src="/assets/images/reviews/feedback-author2.jpg"
              alt="Reviewer"
            />
            <img
              className="bg"
              src="/assets/images/reviews/feedback-author-bg.png"
              alt="Background"
            />
          </div>
        </div>
        <div className="feedback-author">
          <div className="icon">
            <i className="flaticon-quote" />
          </div>
          <div className="title">
            <h4>Kwame Mensah</h4>
            <span>Farmer, Eastern Region</span>
          </div>
          <div className="ratting">
            <h6>Verified purchase</h6>
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
          </div>
        </div>
      </div>
      <div className="feedback-item style-two wow fadeInUp delay-0-6s">
        <div className="content-image">
          <p>
            Ordering is straightforward and the produce arrives in good condition. Being able to see the farmer&rsquo;s name changes how much I trust what I am buying.
          </p>
          <div className="image">
            <img
              src="/assets/images/reviews/feedback-author1.jpg"
              alt="Reviewer"
            />
            <img
              className="bg"
              src="/assets/images/reviews/feedback-author-bg.png"
              alt="Background"
            />
          </div>
        </div>
        <div className="feedback-author">
          <div className="icon">
            <i className="flaticon-quote" />
          </div>
          <div className="title">
            <h4>Efua Danso</h4>
            <span>Customer, Kumasi</span>
          </div>
          <div className="ratting">
            <h6>Verified purchase</h6>
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
          </div>
        </div>
      </div>
      <div className="feedback-item style-two wow fadeInUp delay-0-8s">
        <div className="content-image">
          <p>
            I list what I have picked in the morning and orders come through the same day. It has taken the guesswork out of what to plant next season.
          </p>
          <div className="image">
            <img
              src="/assets/images/reviews/feedback-author2.jpg"
              alt="Reviewer"
            />
            <img
              className="bg"
              src="/assets/images/reviews/feedback-author-bg.png"
              alt="Background"
            />
          </div>
        </div>
        <div className="feedback-author">
          <div className="icon">
            <i className="flaticon-quote" />
          </div>
          <div className="title">
            <h4>Yaw Owusu</h4>
            <span>Farmer, Ashanti Region</span>
          </div>
          <div className="ratting">
            <h6>Verified purchase</h6>
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
          </div>
        </div>
      </div>
    </Slider>
  );
};
export default FeedbackTwoSlider;
