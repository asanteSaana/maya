// Shared by server and client: shapes the backend user object into the profile
// the UI works with, and derives whether the account may sell.

// The backend returns the role as a nested object:
//   role: { _id, name: "Customer", description: "Restaurant customer" }
// It does not return partnerId on auth responses, so the role name is the only
// signal available for deciding whether an account can reach /farmer/*.
const PARTNER_ROLE_NAMES = [
  "partner",
  "farmer",
  "seller",
  "vendor",
  "merchant",
  "admin",
];

// Staff roles. GET /api/orders/all answers 403 rather than 404 for a customer,
// so the backend does gate an all-orders view by role — but it never publishes
// the role names, so this list is a best guess and may need widening once a
// real staff account exists. Admins are also treated as partners, since every
// seller screen is a subset of what an administrator should see.
const ADMIN_ROLE_NAMES = ["admin", "administrator", "superadmin", "super admin"];

const readRole = (payload = {}) => {
  const role = payload.role;

  if (role && typeof role === "object") {
    return { id: role._id || role.id || "", name: role.name || "" };
  }

  // Older/flat shape: a bare id string under `role` or `roleId`.
  return {
    id: (typeof role === "string" ? role : "") || payload.roleId || "",
    name: payload.roleName || "",
  };
};

const roleNameOf = (user) => String(readRole(user).name).trim().toLowerCase();

export const isAdminUser = (user) => {
  if (!user) {
    return false;
  }

  if (typeof user.isAdmin === "boolean") {
    return user.isAdmin;
  }

  return ADMIN_ROLE_NAMES.includes(roleNameOf(user));
};

export const isPartnerUser = (user) => {
  if (!user) {
    return false;
  }

  if (typeof user.isPartner === "boolean") {
    return user.isPartner;
  }

  if (user.partnerId) {
    return true;
  }

  return PARTNER_ROLE_NAMES.includes(roleNameOf(user));
};

/** Strips the accessToken and anything else not needed by the browser. */
export const toPublicUser = (payload = {}) => {
  const role = readRole(payload);

  const profile = {
    id: payload._id || payload.id || "",
    username: payload.username || "",
    email: payload.email || "",
    roleId: role.id,
    roleName: role.name,
    partnerId: payload.partnerId || null,
  };

  const isAdmin = isAdminUser(profile);

  return { ...profile, isAdmin, isPartner: isAdmin || isPartnerUser(profile) };
};
