import { useSpotifyAuth } from "../hooks";
import { Button } from "react-bootstrap";

const SpotifyLogin: React.FC = () => {
  const { login, tokens, loading, error } = useSpotifyAuth();

  return (
    <div className="p-4">
      {tokens ? (
        <div>
          <h2>🎶 Logged in to Spotify!</h2>
          <pre>{JSON.stringify(tokens, null, 2)}</pre>
        </div>
      ) : (
        <Button
          onClick={login}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {loading ? "Connecting..." : "Login with Spotify"}
        </Button>
      )}

      {error && <p className="text-red-500 mt-2">⚠ {error}</p>}
    </div>
  );
};

export default SpotifyLogin;
