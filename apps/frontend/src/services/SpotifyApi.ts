export async function authorize() {
  const queryParams = new URLSearchParams({
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
    scope:
      "playlist-read-private playlist-modify-private playlist-modify-public user-library-read user-recently-played user-top-read",
  });
  const res = await fetch(
    "https://accounts.spotify.com/authorize?" + queryParams
  );
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
