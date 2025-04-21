import { useState, useEffect } from "react";
import { Row } from "react-bootstrap";

interface SelectorProps {
  playlist: string | number;
  changePlaylist: (playlist: string | number) => void;
}

interface Playlist {
  id: string;
  name: string;
}

const Selector: React.FC<SelectorProps> = ({ playlist, changePlaylist }) => {
  // const [playlists, setPlaylists] = useState<Playlist[]>([
  //   { id: "", name: "" },
  // ]);

  // useEffect(() => {
  //   const fetchPlaylists = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://api.spotify.com/v1/me/playlists`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${import.meta.env.VITE_SPOTIFY_API_KEY}`,
  //           },
  //         }
  //       );
  //       const data = await response.json();
  //       setPlaylists(data.items);
  //     } catch (error) {
  //       console.error("Error fetching playlists:", error);
  //     }
  //   };

  //   fetchPlaylists();
  // }, []);

  return (
    <Row className="mb-4">
      <h1 className="text-center mb-4">Playlist Manager</h1>
      <label htmlFor="playlist" className="form-label">
        Select Playlist:
      </label>
      {/* <select
        id="playlist"
        className="form-select"
        value={playlist}
        onChange={(e) => changePlaylist(e.target.value)}
      >
        {playlists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select> */}
    </Row>
  );
};

export default Selector;
