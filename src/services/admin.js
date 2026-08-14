import { unwrapApiData } from "./api";
import { createRole, getPartnerOrders } from "./partner";

/**
 * The widest view of orders a staff account can obtain.
 *
 * There is no marketplace-wide orders endpoint. An earlier version of this
 * module called `/api/orders/all`, which looked like a hidden administrative
 * route because it answers 403 for a customer instead of 404. It is not: that
 * is `GET /api/orders/:id` refusing the request. With a staff token it gets
 * past the guard, reaches the database, fails to cast "all" to an ObjectId and
 * returns 500 — the same behaviour `/api/products/all` shows. The published
 * collection has no such route.
 *
 * `/api/partner/orders` is what genuinely exists: every order placed against
 * the signed-in partner's listings. Where one partner owns the catalogue, that
 * is every order in the marketplace; where several do, each sees only their
 * own. Listing users, listing roles and any statistics endpoint all return 404,
 * so those screens cannot be built until the backend grows them.
 */
export const getAllOrders = (options) => getPartnerOrders(options);

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
