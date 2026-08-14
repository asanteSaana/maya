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

// Staff roles — accounts allowed into /admin.
//
// This backend ships only two roles, Customer and Partner, and "Partner" is the
// elevated one: GET /api/orders/all answers 403 for a customer, and the staff
// account confirmed in use carries roleName "Partner" with an id that also
// appears as partnerId on catalogue products. There is no separate admin role
// to key on, so Partner grants the console.
//
// The list is configurable so a genuine admin role can be adopted later by
// setting NEXT_PUBLIC_MAYA_ADMIN_ROLES (comma-separated) in the hosting
// environment, without shipping a code change.
const DEFAULT_ADMIN_ROLE_NAMES = [
  "partner",
  "admin",
  "administrator",
  "superadmin",
  "super admin",
];

const adminRoleNames = () => {
  const configured = process.env.NEXT_PUBLIC_MAYA_ADMIN_ROLES;

  if (!configured) {
    return DEFAULT_ADMIN_ROLE_NAMES;
  }

  const names = configured
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);

  return names.length ? names : DEFAULT_ADMIN_ROLE_NAMES;
};

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

/**
 * The role name is consulted before any stored flag.
 *
 * The profile cookie carries the isAdmin/isPartner values computed when the
 * session began and lives for seven days. Trusting those first would mean a
 * change to the accepted role names only reached a user after they signed out
 * and back in — so a configuration fix would appear not to work. Deriving from
 * the role name keeps the decision current; the stored flag is a fallback for
 * payloads that carry no role at all.
 */
export const isAdminUser = (user) => {
  if (!user) {
    return false;
  }

  const name = roleNameOf(user);

  if (name) {
    return adminRoleNames().includes(name);
  }

  return typeof user.isAdmin === "boolean" ? user.isAdmin : false;
};

export const isPartnerUser = (user) => {
  if (!user) {
    return false;
  }

  // Same ordering as isAdminUser, and for the same reason.
  const name = roleNameOf(user);

  if (name) {
    return PARTNER_ROLE_NAMES.includes(name) || Boolean(user.partnerId);
  }

  if (user.partnerId) {
    return true;
  }

  return typeof user.isPartner === "boolean" ? user.isPartner : false;
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
