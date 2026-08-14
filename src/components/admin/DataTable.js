import { useMemo, useState } from "react";
import { EmptyState } from "../shop/StateMessage";

/**
 * Searchable, sortable, paginated table for the admin screens.
 *
 * Everything happens client-side: the backend takes no query, sort or page
 * parameters, so the whole collection arrives at once regardless. That is fine
 * at the current scale and keeps the rate limit (10 requests per minute) free
 * for the writes that matter.
 *
 * Columns take `{ key, header, render?, value?, sortable? }` — `value` supplies
 * the sort/search text when `render` returns markup.
 */
const DataTable = ({
  columns,
  rows,
  pageSize = 10,
  searchPlaceholder = "Search…",
  emptyTitle = "Nothing to show",
  emptyMessage = "No records matched.",
  toolbar,
}) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "", direction: "asc" });
  const [page, setPage] = useState(1);

  const textOf = (row, column) => {
    if (column.value) {
      return column.value(row);
    }

    const raw = row[column.key];
    return raw === null || raw === undefined ? "" : raw;
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return rows;
    }

    return rows.filter((row) =>
      columns.some((column) =>
        String(textOf(row, column)).toLowerCase().includes(term)
      )
    );
    // textOf is stable for a given columns/rows pair.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, rows, search]);

  const sorted = useMemo(() => {
    if (!sort.key) {
      return filtered;
    }

    const column = columns.find((entry) => entry.key === sort.key);

    if (!column) {
      return filtered;
    }

    const factor = sort.direction === "desc" ? -1 : 1;

    return [...filtered].sort((a, b) => {
      const left = textOf(a, column);
      const right = textOf(b, column);

      if (typeof left === "number" && typeof right === "number") {
        return (left - right) * factor;
      }

      return String(left).localeCompare(String(right)) * factor;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, filtered, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (key) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );

  return (
    <div className="admin-table-wrap">
      <div className="d-flex align-items-center justify-content-between flex-wrap mb-20">
        <div className="form-group mb-0 admin-table-search">
          <input
            type="search"
            className="form-control"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </div>
        {toolbar}
      </div>

      {sorted.length === 0 ? (
        <EmptyState title={emptyTitle} message={emptyMessage} />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table admin-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} scope="col">
                      {column.sortable === false ? (
                        column.header
                      ) : (
                        <button
                          type="button"
                          className="admin-sort-btn"
                          onClick={() => toggleSort(column.key)}
                        >
                          {column.header}
                          {sort.key === column.key && (
                            <i
                              className={`fas fa-caret-${
                                sort.direction === "asc" ? "up" : "down"
                              } ml-1`}
                            />
                          )}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((row, index) => (
                  <tr key={row.id || row._id || index}>
                    {columns.map((column) => (
                      <td key={column.key} data-label={column.header}>
                        {column.render ? column.render(row) : textOf(row, column)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex align-items-center justify-content-between flex-wrap pt-15">
            <p className="mb-0">
              Showing {(safePage - 1) * pageSize + 1}–
              {Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
            </p>
            {pageCount > 1 && (
              <ul className="pagination mb-0">
                <li>
                  <button
                    type="button"
                    className="admin-page-btn"
                    disabled={safePage === 1}
                    onClick={() => setPage(safePage - 1)}
                  >
                    Previous
                  </button>
                </li>
                <li>
                  <span className="px-2">
                    Page {safePage} of {pageCount}
                  </span>
                </li>
                <li>
                  <button
                    type="button"
                    className="admin-page-btn"
                    disabled={safePage === pageCount}
                    onClick={() => setPage(safePage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DataTable;
