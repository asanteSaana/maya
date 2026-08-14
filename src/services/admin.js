import { apiRequest, unwrapApiData } from "./api";
import { normalizeOrders } from "./orders";
import { createRole } from "./partner";

/**
 * Every order in the marketplace, across all sellers and customers.
 *
 * Two earlier attempts were wrong and are worth recording. `/api/orders/all`
 * is not an administrative route at all — it is `GET /api/orders/:id` given
 * "all" as the identifier, which answers 403 to a customer (hence the mistaken
 * inference that it existed) and 500 with a Mongoose CastError to a staff
 * token. `/api/partner/orders` does exist but is narrower: it returns only the
 * orders placed against the signed-in partner's own listings.
 *
 * `/api/partner/orders/system/all` was added to the API documentation later
 * and is the genuine system-wide view, verified returning every order.
 */
export const getAllOrders = async ({ signal } = {}) => {
  const payload = await apiRequest("/api/partner/orders/system/all", { signal });
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
