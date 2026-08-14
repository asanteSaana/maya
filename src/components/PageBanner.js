import Link from "next/link";

/**
 * Page heading and breadcrumb.
 *
 * Two treatments. Marketing pages keep the photographic banner, where a large
 * image is the point. Pages where the visitor came to do something — sign in,
 * pay, check an order — use `compact`: a full-bleed hero there is 300-odd
 * pixels of decoration between the visitor and the task, and it pushes the form
 * below the fold on a laptop.
 */
const PageBanner = ({ pageName, pageTitle, compact = false }) => {
  const title = pageTitle || pageName;

  if (compact) {
    return (
      <section className="page-crumb">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb page-crumb-trail">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {pageName}
              </li>
            </ol>
          </nav>
          <h1 className="page-crumb-title">{title}</h1>
        </div>
      </section>
    );
  }

  return (
    <section
      className="page-banner text-white py-165 rpy-130"
      style={{ backgroundImage: "url(/assets/images/banner/banner.jpg)" }}
    >
      <div className="container">
        <div className="banner-inner">
          <h1 className="page-title wow fadeInUp delay-0-2s">{title}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center wow fadeInUp delay-0-4s">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {pageName}
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
};
export default PageBanner;
