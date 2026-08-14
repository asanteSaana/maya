import { apiRequest, unwrapApiData } from "./api";
import { normalizeOrders } from "./orders";
import { createRole } from "./partner";

/**
 * Administrator-only reads.
 *
 * The published API documentation covers none of this. `GET /api/orders/all`
 * was found by probing: it answers 403 for a customer rather than 404, so the
 * route exists and is gated by role. Everything an administrator might also
 * want — listing users, listing roles, cross-customer statistics — returns 404,
 * so those screens cannot be built until the backend grows the endpoints.
 */
export const getAllOrders = async ({ signal } = {}) => {
  const payload = await apiRequest("/api/orders/all", { signal });
  return normalizeOrders(unwrapApiData(payload));
};

/**
 * Creates a role and returns its id.
 *
 * This is the only route that can mint the seller role whose id registration
 * needs — self-signup always returns "Customer" because no other role id is
 * known, and nothing lists the existing roles. The POST wrapper already lives
 * in partner.js; this only normalises the reply so the id can be read off it.
 */
export const createRoleAndReadId = async ({ name, description }) => {
  const payload = await createRole({ name, description });
  const data = unwrapApiData(payload);
  const role = Array.isArray(data) ? data[0] : data;

  return {
    id: role?._id || role?.id || "",
    name: role?.name || name,
    description: role?.description || description || "",
    raw: role,
  };
};
