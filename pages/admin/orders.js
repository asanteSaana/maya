import { useCallback, useEffect, useMemo, useState } from "react";
import AdminLayout from "../../src/components/admin/AdminLayout";
import DataTable from "../../src/components/admin/DataTable";
import PageHeader from "../../src/components/admin/PageHeader";
import FormAlert from "../../src/components/FormAlert";
import OrderStatusBadge from "../../src/components/shop/OrderStatusBadge";
import {
  ErrorState,
  LoadingState,
} from "../../src/components/shop/StateMessage";
import { formatPrice, ORDER_STATUSES } from "../../src/services/constants";
import { getAllOrders } from "../../src/services/admin";
import { deleteOrder, updateOrderStatus } from "../../src/services/partner";

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setOrders(await getAllOrders());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (order, status) => {
    setBusyId(order.id);
    setActionError("");
    setNotice("");

    try {
      await updateOrderStatus(order.id, status);
      // Patch locally rather than refetching: the backend allows only 10
      // requests a minute and a reload would spend one on every click.
      setOrders((current) =>
        current.map((entry) =>
          entry.id === order.id ? { ...entry, status } : entry
        )
      );
      setNotice(`Order #${order.id.slice(-8)} marked ${status}.`);
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusyId("");
    }
  };

  const removeOrder = async (order) => {
    setBusyId(order.id);
    setActionError("");
    setNotice("");

    try {
      await deleteOrder(order.id);
      setOrders((current) => current.filter((entry) => entry.id !== order.id));
      setNotice(`Order #${order.id.slice(-8)} deleted.`);
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusyId("");
    }
  };

  const visible = useMemo(
    () =>
      statusFilter
        ? orders.filter((order) => order.status === statusFilter)
        : orders,
    [orders, statusFilter]
  );

  const columns = useMemo(
    () => [
      {
        key: "id",
        header: "Order",
        render: (order) => <span>#{order.id.slice(-8)}</span>,
      },
      {
        key: "items",
        header: "Items",
        value: (order) =>
          order.products.map((line) => line.productName).join(", "),
        render: (order) => (
          <span>
            {order.products
              .map(
                (line) =>
                  `${line.productName || "Item"}${
                    line.quantity > 1 ? ` ×${line.quantity}` : ""
                  }`
              )
              .join(", ") || "—"}
          </span>
        ),
      },
      {
        key: "amount",
        header: "Total",
        value: (order) => order.amount,
        render: (order) => formatPrice(order.amount),
      },
      {
        key: "city",
        header: "Deliver to",
        value: (order) => order.address?.city || "",
        render: (order) => order.address?.city || "—",
      },
      {
        key: "createdAt",
        header: "Placed",
        value: (order) => order.createdAt || "",
        render: (order) => formatDate(order.createdAt),
      },
      {
        key: "status",
        header: "Status",
        render: (order) => <OrderStatusBadge status={order.status} />,
      },
      {
        key: "actions",
        header: "Actions",
        sortable: false,
        render: (order) => (
          <div className="admin-row-actions">
            <select
              className="form-control"
              value={order.status}
              disabled={busyId === order.id}
              onChange={(event) => changeStatus(order, event.target.value)}
              aria-label={`Status for order ${order.id}`}
            >
              {ORDER_STATUSES.map((status) => (
                <option value={status} key={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="admin-danger-btn"
              disabled={busyId === order.id}
              onClick={() => removeOrder(order)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    // changeStatus/removeOrder are stable enough for this table's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [busyId]
  );

  return (
    <AdminLayout pageName="All Orders">
      <PageHeader
        title="All orders"
        subtitle="Every order placed across the marketplace"
        icon="flaticon-shopping-bag"
        actions={
          <button
            type="button"
            className="theme-btn style-two"
            onClick={load}
            disabled={isLoading}
          >
            Refresh <i className="fas fa-sync-alt" />
          </button>
        }
      />

      <FormAlert error={actionError} success={notice} />

      {isLoading && <LoadingState message="Loading orders…" />}

      {!isLoading && error && <ErrorState message={error} onRetry={load} />}

      {!isLoading && !error && (
        <DataTable
          columns={columns}
          rows={visible}
          searchPlaceholder="Search by item, city or order id…"
          emptyTitle="No orders"
          emptyMessage={
            statusFilter
              ? `No orders are currently ${statusFilter}.`
              : "No orders have been placed yet."
          }
          toolbar={
            <div className="form-group mb-0">
              <select
                className="form-control"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
              >
                <option value="">All statuses</option>
                {ORDER_STATUSES.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          }
        />
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
