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
  name: string;
  description: string;
  image: string;
  rating: number;
}

export interface ItemProps {
  id: number;
  attributes: ItemAttributes;
  updateRating: (id: number, rating: number) => void;
  deleteItems: (id: number) => void;
}

// // // // // //
// SpotifyAPI  //
// // // // // //

export interface authApiResponse {
  access_token: string;
  refresh_token: string;
}
