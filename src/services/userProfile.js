// Shared by server and client: shapes the backend user object into the profile
// the UI works with, and derives whether the account is a selling farmer.

export const isPartnerUser = (user) => {
  if (!user) {
    return false;
  }

  if (typeof user.isPartner === "boolean") {
    return user.isPartner;
  }

  // A partner account is linked to a partner record; customers have none.
  return Boolean(user.partnerId);
};

/** Strips the accessToken and anything else not needed by the browser. */
export const toPublicUser = (payload = {}) => {
  const id = payload._id || payload.id || "";

  return {
    id,
    username: payload.username || "",
    email: payload.email || "",
    roleId: payload.roleId || payload.role || "",
    partnerId: payload.partnerId || null,
    isPartner: isPartnerUser(payload),
  };
};
