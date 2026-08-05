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

  const { name } = readRole(user);
  return PARTNER_ROLE_NAMES.includes(String(name).trim().toLowerCase());
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

  return { ...profile, isPartner: isPartnerUser(profile) };
};
