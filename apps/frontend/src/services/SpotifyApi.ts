import { authApiResponse } from "@shared/types";

export async function authorize(): Promise<authApiResponse> {
  const res = await fetch("http://localhost:3123/auth/login");
  if (res.status === 200) {
    const data = await res.json();
    return data;
  } else {
    throw new Error("Authorization failed");
  }
}

export async function fetchWebApi(
  endpoint: string,
  method: string,
  body?: string | null
) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_SPOTIFY_API_KEY}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

export async function fetchPlaylists() {
  return await fetchWebApi(`v1/me/playlists`, "GET", null);
}
