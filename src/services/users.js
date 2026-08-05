import { apiRequest, unwrapApiData } from "./api";

export const updateUser = async (payload) => {
  const response = await apiRequest("/api/users/", {
    method: "PUT",
    body: payload,
  });

  return unwrapApiData(response);
};

export const deleteUser = () => apiRequest("/api/users/", { method: "DELETE" });
