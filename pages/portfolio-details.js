import Link from "next/link";
import ClientLogoSlider from "../src/components/ClientLogoSlider";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layout/Layout";
const PortfolioDetails = () => {
  return (
    <Layout
      title="Gallery"
      description="A look at the produce and the farms behind it."
    >
      <PageBanner pageName={"Portfolio Details"} />
      <section className="portfolio-details-area rel z-1 py-130 rpy-100">
        <div className="container">
          <div className="portfolio-details-content">
            <div className="image mb-50 wow fadeInUp delay-0-2s">
              <img
                src="/assets/images/gellery/portfolio-details.jpg"
                alt="Portfolio Details"
              />
            </div>
            <div className="row wow fadeInUp delay-0-2s">
              <div className="col-lg-6">
                <h2>Organic Fruits</h2>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  <div className="col-sm-4 col-6">
                    <div className="pd-inner-item">
                      <h4>Category</h4>
                      <p>Organic Foods Vegetables</p>
                    </div>
                  </div>
                  <div className="col-sm-4 col-6">
                    <div className="pd-inner-item">
                      <h4>Clients</h4>
                      <p>Microsoft LTS Washington</p>
                    </div>
                  </div>
                  <div className="col-sm-4 col-6">
                    <div className="pd-inner-item">
                      <h4>Date</h4>
                      <p>25 February 2022</p>
                    </div>
                  </div>
                </div>
                <hr className="mt-30 mb-30" />
                <p>
                  Every listing shows the farm it came from. Where produce is graded by size, the farmer sets a price for each grade.</p>
                <hr className="mt-45" />
              </div>
            </div>
            <div className="row pt-55 pb-85 rpb-40 wow fadeInUp delay-0-2s">
              <div className="col-lg-6">
                <h2>Project Benefit</h2>
              </div>
              <div className="col-lg-6">
                <p>
                  The marketplace runs on real inventory: if a farmer has not listed it, it is not on sale, and stock levels come from the farmer directly.</p>
              </div>
            </div>
            <hr />
            <div className="portfolio-next-prev pt-50 rpt-40">
              <div className="prev-portfolio wow fadeInLeft delay-0-2s">
                <div className="image">
                  <img
                    src="/assets/images/gellery/portfolio-prev.jpg"
                    alt="Portfolio"
                  />
                </div>
                <div className="content">
                  <h4>
                    <Link href="/portfolio-details">Organic Vegetables</Link>
                  </h4>
                  <span className="category">Food, Organic</span>
                </div>
              </div>
              <Link href="/portfolio-grid">
                <a className="show-all">
                  <i className="fal fa-ellipsis-h-alt" />
                  <i className="fal fa-ellipsis-h-alt" />
                  <i className="fal fa-ellipsis-h-alt" />
                </a>
              </Link>
              <div className="next-portfolio wow fadeInRight delay-0-2s">
                <div className="content">
                  <h4>
                    <Link href="/portfolio-details">Organic Fruits</Link>
                  </h4>
                  <span className="category">Food, Organic</span>
                </div>
                <div className="image">
                  <img
                    src="/assets/images/gellery/portfolio-next.jpg"
                    alt="News"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Portfolio Details End */}
      {/* Client Logo Section Start */}
      <div className="client-logo-section text-center bg-light-green py-60">
        <div className="container">
          <ClientLogoSlider />
        </div>
        <div className="client-logo-shapes">
          <img
            className="shape-one"
            src="/assets/images/shapes/cl-shape1.png"
            alt="Shape"
          />
          <img
            className="shape-two"
            src="/assets/images/shapes/cl-shape2.png"
            alt="Shape"
          />
          <img
            className="shape-three"
            src="/assets/images/shapes/cl-shape3.png"
            alt="Shape"
          />
          <img
            className="shape-four"
            src="/assets/images/shapes/cl-shape4.png"
            alt="Shape"
          />
          <img
            className="shape-five"
            src="/assets/images/shapes/cl-shape5.png"
            alt="Shape"
          />
          <img
            className="shape-six"
            src="/assets/images/shapes/cl-shape6.png"
            alt="Shape"
          />
        </div>
      </div>
    </Layout>
  );
};
export default PortfolioDetails;
