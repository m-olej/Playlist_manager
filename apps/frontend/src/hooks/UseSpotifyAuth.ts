// src/hooks/useSpotifyAuth.ts
import { useState, useCallback } from "react";
import { useSpotifyRefreshToken } from "./UseSpotifyRefresh";

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export function useSpotifyAuth() {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistTokens = (tokens: AuthTokens) => {
    localStorage.setItem("AccessToken", tokens.access_token);
    localStorage.setItem("RefreshToken", tokens.refresh_token);
    localStorage.setItem("ExpiresIn", tokens.expires_in.toString());

    setTokens(tokens);
  };

  const login = useCallback(() => {
    setLoading(true);
    setError(null);

    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      "http://localhost:3123/auth/login",
      "SpotifyAuth",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      setLoading(false);
      setError("Popup blocked");
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "http://127.0.0.1:3123") {
        console.log("Invalid origin:", event.origin);
        return;
      }

      if (event.data.type === "spotify-auth-success") {
        console.log("Spotify auth success:", event.data.payload);
        const { access_token, refresh_token, expires_in } = event.data.payload;
        persistTokens({ access_token, refresh_token, expires_in });
      } else if (event.data.type === "spotify-auth-error") {
        console.log("Spotify auth error:", event.data.error);
        setError(event.data.error || "Unknown error");
      }

      setLoading(false);
      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  }, []);

  // 🧪 Use refresh logic
  useSpotifyRefreshToken({
    refresh_token: tokens?.refresh_token ?? "",
    expires_in: tokens?.expires_in ?? 3600,
    onUpdate: (newToken) =>
      setTokens((prev) => (prev ? { ...prev, access_token: newToken } : prev)),
  });

  return { login, tokens, loading, error };
}
