// Registration accepts a roleId, but the backend documentation does not publish
// the customer/farmer identifiers. Set them here once they are known — until
// then registration omits roleId and the backend applies its own default.
//
// To discover them: register one account of each type through the backend
// directly and read the roleId off the response.
export const ROLE_IDS = {
  customer: process.env.NEXT_PUBLIC_MAYA_ROLE_CUSTOMER || "",
  farmer: process.env.NEXT_PUBLIC_MAYA_ROLE_FARMER || "",
};

export const ORDER_STATUSES = ["pending", "accepted", "rejected"];

export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

// Maps an order status onto the template's existing badge colour utilities.
export const ORDER_STATUS_CLASSES = {
  pending: "text-warning",
  accepted: "text-success",
  rejected: "text-danger",
};

export const SHIPPING_FEE = 10;
export const VAT_RATE = 0.15;
export const CURRENCY = "GHS";

export const formatPrice = (value) =>
  `${CURRENCY} ${Number(value || 0).toFixed(2)}`;
