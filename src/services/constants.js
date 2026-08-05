// Confirmed against the live backend by registering test accounts: signup
// always returns role { _id: "6a0e0b52...", name: "Customer" }, whatever roleId
// is sent. There is no endpoint that lists roles, so the seller role id is
// still unknown and sellers have to be provisioned out-of-band.
//
// Set MAYA_ROLE_FARMER (via NEXT_PUBLIC_MAYA_ROLE_FARMER) once that id is known
// and the "Sell my produce" path will start working on its own.
export const CUSTOMER_ROLE_ID = "6a0e0b52fed6cba1ba69c3fc";

export const ROLE_IDS = {
  customer: process.env.NEXT_PUBLIC_MAYA_ROLE_CUSTOMER || CUSTOMER_ROLE_ID,
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
