import {
  ORDER_STATUS_CLASSES,
  ORDER_STATUS_LABELS,
} from "../../services/constants";

const OrderStatusBadge = ({ status }) => {
  const key = String(status || "pending").toLowerCase();

  return (
    <strong className={`stock ${ORDER_STATUS_CLASSES[key] || ""}`}>
      {ORDER_STATUS_LABELS[key] || status}
    </strong>
  );
};

export default OrderStatusBadge;
