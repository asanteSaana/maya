import { useEffect } from "react";

// Every deploy gives the lazily-loaded chunks new filenames. A visitor who had
// the site open across a deploy is still running the old page, so the moment a
// next/dynamic component loads — the countdown on the homepage, for instance —
// it requests a chunk that no longer exists and the section crashes with
// "Loading chunk … failed". Reloading picks up the current build.
const RELOAD_KEY = "maya.chunk-reload";
const RELOAD_COOLDOWN_MS = 10000;

const isChunkError = (value) => {
  if (!value) {
    return false;
  }

  if (value.name === "ChunkLoadError") {
    return true;
  }

  const message = String(value.message || value);
  return /Loading chunk .+ failed/i.test(message);
};

export const useChunkRecovery = () => {
  useEffect(() => {
    // The dev server serves chunks on demand and has its own error overlay;
    // reloading underneath it would just fight HMR.
    if (process.env.NODE_ENV !== "production") {
      return undefined;
    }

    const recover = (candidate) => {
      if (!isChunkError(candidate)) {
        return;
      }

      let last = 0;

      try {
        last = Number(window.sessionStorage.getItem(RELOAD_KEY) || 0);
      } catch {
        // Private browsing can deny sessionStorage; a single reload without the
        // guard is still better than a permanently broken section.
      }

      // If a reload just happened the chunk is genuinely gone, not stale, so
      // stop rather than loop.
      if (last && Date.now() - last < RELOAD_COOLDOWN_MS) {
        return;
      }

      try {
        window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
      } catch {
        // Ignore — see above.
      }

      window.location.reload();
    };

    const handleError = (event) => recover(event.error || event.message);
    const handleRejection = (event) => recover(event.reason);

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);
};

export default useChunkRecovery;
