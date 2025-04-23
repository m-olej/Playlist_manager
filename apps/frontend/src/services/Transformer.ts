import { ItemAttributes, playlistItemsApiResponse } from "@shared/types";

export function createTrackItems(
  trackItems: playlistItemsApiResponse[]
): ItemAttributes[] {
  const tracks = [];

  for (const item of trackItems) {
    const track = item.name;
    const artists = item.artists;
    const album = item.album.name;
    // pick image with dimensions 640x640
    const image = item.album.images.find(
      (img) => img.width === 300 && img.height === 300
    )?.url;
    const rating = 0; // Default rating

    tracks.push({
      id: item.id,
      name: track,
      artists,
      album,
      description: `Released by ${artists.join(", ")} on ${
        item.album.release
      } ${
        item.album.type == "single"
          ? "as a single"
          : `with album ${item.album.name}`
      } `,
      image,
      rating,
    });
  }

  return tracks;
}
