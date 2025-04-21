import { Row } from "react-bootstrap";
import SpotifyLogin from "./SpotifyLogin";

interface SelectorProps {
  playlist: string | number;
  changePlaylist: (playlist: string | number) => void;
}

interface Playlist {
  id: string;
  name: string;
}

const Selector: React.FC<SelectorProps> = ({ playlist, changePlaylist }) => {
  const playlists: Playlist[] = [
    { id: "1", name: "Playlist 1" },
    { id: "2", name: "Playlist 2" },
    { id: "3", name: "Playlist 3" },
  ];

  console.log(localStorage.getItem("AccessToken"));

  return (
    <Row className="mb-4">
      <h1 className="text-center mb-4">Playlist Manager</h1>
      {!localStorage.getItem("AccessToken") ? (
        <SpotifyLogin />
      ) : (
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
      )}
    </Row>
  );
};

export default Selector;
