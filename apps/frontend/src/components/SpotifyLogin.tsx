import { useSpotifyAuth } from "../hooks";
import { Button, Row } from "react-bootstrap";
import { useEffect } from "react";

const SpotifyLogin: React.FC = () => {
  const { login, tokens, loading, error } = useSpotifyAuth();

  useEffect(() => {
    console.log("Tokens changed:", tokens);
    if (tokens) {
      console.log("redirecting...");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [tokens]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Row className="p-4">
        {tokens ? (
          <div>
            <h1>🎶 Logged in to Spotify!</h1>
            <h2>Redirecting...</h2>
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
      </Row>
    </div>
  );
};

export default SpotifyLogin;
