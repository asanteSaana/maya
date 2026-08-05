import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UNAUTHORIZED_EVENT } from "../services/api";
import {
  fetchSession,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/auth";
import { isPartnerUser } from "../services/userProfile";

// The access token lives in an httpOnly cookie and is never readable here. Only
// the user profile is cached locally, and purely so the header can render the
// signed-in state without waiting on the session round-trip.
const USER_STORAGE_KEY = "maya.user";

const AuthContext = createContext(null);

const readCachedUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(USER_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const cacheUser = (user) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const applyUser = useCallback((nextUser) => {
    setUser(nextUser || null);
    cacheUser(nextUser || null);
    return nextUser || null;
  }, []);

  // Optimistic hydration from cache, then confirm against the cookie. If the
  // cookie expired while the tab was closed, the cached profile is discarded.
  useEffect(() => {
    let cancelled = false;

    setUser(readCachedUser());

    fetchSession()
      .then((response) => {
        if (!cancelled) {
          applyUser(response?.user || null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          applyUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [applyUser]);

  const login = useCallback(
    async (credentials) => {
      const response = await loginUser(credentials);
      return applyUser(response?.user);
    },
    [applyUser]
  );

  const register = useCallback(
    async (payload) => {
      const response = await registerUser(payload);
      return applyUser(response?.user);
    },
    [applyUser]
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      applyUser(null);
    }
  }, [applyUser]);

  // Any proxied request that comes back 401 means the cookie is gone or stale.
  useEffect(() => {
    const handleUnauthorized = () => applyUser(null);

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [applyUser]);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isPartner: isPartnerUser(user),
      isReady,
      login,
      logout,
      register,
      user,
    }),
    [isReady, login, logout, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
