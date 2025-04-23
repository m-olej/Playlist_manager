// // // //
// Item  //
// // // //
export interface ItemType {
  id: number;
  name: string;
  description: string;
  image: string;
  rating: number;
}

export interface ItemAttributes {
  id: string;
  name: string;
  artists: string[];
  album: string;
  description: string;
  image: string | undefined;
  rating: number;
}

export interface addedItem {
  uri: string;
}

export interface ItemProps {
  id: string;
  attributes: ItemAttributes;
  updateRating: (id: string, rating: number) => void;
  deleteItems: (id: string) => void;
}

// // // // // //
// SpotifyAPI  //
// // // // // //

// Requests
export interface apiRequest {
  access_token: string;
}

export interface playlistsRequest extends apiRequest {
  limit: number;
}

export interface addTrackRequest extends apiRequest {
  track_uri: string;
}

// Responses

export interface authApiResponse {
  access_token: string;
  refresh_token: string;
}

export interface playlistApiResponse {
  id: string;
  name: string;
}

export interface Image {
  height: number;
  width: number;
  url: string;
}
export interface playlistItemsApiResponse {
  id: string;
  name: string;
  artists: string[];
  album: {
    name: string;
    type: string;
    release: string;
    images: Image[];
  };
}
