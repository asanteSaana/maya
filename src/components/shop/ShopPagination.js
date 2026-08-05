/**
 * State-driven pagination for the product grids. The template's original
 * Pagination component paginates by toggling CSS classes on DOM nodes, which
 * does not survive React re-rendering a live product list — but the markup and
 * classes here are the same, so the styling is identical.
 */
const ShopPagination = ({ page, pageCount, onChange }) => {
  if (pageCount <= 1) {
    return null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <ul className="pagination flex-wrap justify-content-center pt-10">
      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
        <a
          className="page-link"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onChange(Math.max(1, page - 1));
          }}
        >
          <i className="fas fa-chevron-left" />
        </a>
      </li>
      {pages.map((value) => (
        <li className={`page-item ${page === value ? "active" : ""}`} key={value}>
          <a
            className="page-link"
            href="#"
            onClick={(event) => {
              event.preventDefault();
              onChange(value);
            }}
          >
            {value}
          </a>
        </li>
      ))}
      <li className={`page-item ${page === pageCount ? "disabled" : ""}`}>
        <a
          className="page-link"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onChange(Math.min(pageCount, page + 1));
          }}
        >
          <i className="fas fa-chevron-right" />
        </a>
      </li>
    </ul>
  );
};

export default ShopPagination;
