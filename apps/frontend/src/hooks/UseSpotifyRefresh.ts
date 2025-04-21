import { useEffect, useRef } from "react";

interface RefreshTokenOptions {
  refresh_token: string;
  onUpdate: (newToken: string) => void;
  expires_in?: number; // Optional: allow caller to set custom expiry
}

export function useSpotifyRefreshToken({
  refresh_token,
  onUpdate,
  expires_in = 3600, // default to 1 hour
}: RefreshTokenOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => {}, expires_in));

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch("http://localhost:3123/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token }),
        });

        const data = await res.json();
        if (res.ok && data.access_token) {
          onUpdate(data.access_token);
        } else {
          console.error("Failed to refresh token:", data);
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
      }
    };

    // Refresh 1 minute before token expiry
    timeoutRef.current = setTimeout(refresh, (expires_in - 60) * 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [refresh_token, onUpdate, expires_in]);
}
