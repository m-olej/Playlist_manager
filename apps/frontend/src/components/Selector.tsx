import { playlistApiResponse } from "@shared/types";
import { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import { fetchPlaylists } from "../services";

interface SelectorProps {
  playlist: string | number;
  changePlaylist: (playlist: string) => void;
}

const Selector: React.FC<SelectorProps> = ({ playlist, changePlaylist }) => {
  const [playlists, setPlaylists] = useState<playlistApiResponse[]>([]);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const data: playlistApiResponse[] = await fetchPlaylists();
        setPlaylists([{ id: "0", name: "" }, ...data]);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    getPlaylists();
  }, []);

  return (
    <Row className="mb-4">
      <h1 className="text-center mb-4">Playlist Manager</h1>
      <div>
        <label htmlFor="playlist" className="form-label">
          Select Playlist:
        </label>
        <select
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
        </select>
      </div>
    </Row>
  );
};

export default Selector;
