import {
  addTrackRequest,
  apiRequest,
  authApiResponse,
  playlistApiResponse,
  playlistItemsApiResponse,
  playlistsRequest,
} from "@shared/types";
import { createTrackItems } from "./Transformer";

const BACKEND_URL = "http://localhost:3123";

export async function authorize(): Promise<authApiResponse> {
  const res = await fetch(`${BACKEND_URL}/auth/login`);
  if (res.status === 200) {
    const data = await res.json();
    return data;
  } else {
    throw new Error("Authorization failed");
  }
}

export async function fetchPlaylists() {
  const accessToken = localStorage.getItem("AccessToken");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${BACKEND_URL}/api/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: accessToken,
      limit: 5,
    } satisfies playlistsRequest),
  });

  if (res.status === 200) {
    const data = (await res.json()) as playlistApiResponse[];
    return data;
  } else {
    throw new Error("Failed to fetch playlists");
  }
}

export async function fetchPlaylistItems(playlist_id: string) {
  const accessToken = localStorage.getItem("AccessToken");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${BACKEND_URL}/api/playlists/${playlist_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: accessToken,
    } satisfies apiRequest),
  });

  if (res.status === 200) {
    const data = (await res.json()) as playlistItemsApiResponse[];
    console.log(data);
    return createTrackItems(data);
  } else {
    throw new Error("Failed to fetch playlists");
  }
}

export async function addTrackToPlaylist(
  playlist_id: string,
  track_uri: string
): Promise<number> {
  const accessToken = localStorage.getItem("AccessToken");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${BACKEND_URL}/api/playlists/${playlist_id}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_token: accessToken,
      track_uri,
    } satisfies addTrackRequest),
  });

  if (res.status === 200) {
    return res.status;
  } else {
    throw new Error("Failed to add track to playlist");
  }
}

export async function deleteTrackFromPlaylist(
  playlist_id: string,
  track_uri: string
): Promise<number> {
  const accessToken = localStorage.getItem("AccessToken");
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(
    `${BACKEND_URL}/api/playlists/${playlist_id}/delete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
        track_uri,
      } satisfies addTrackRequest),
    }
  );

  if (res.status === 200) {
    return res.status;
  } else {
    throw new Error("Failed to delete track from playlist");
  }
}
