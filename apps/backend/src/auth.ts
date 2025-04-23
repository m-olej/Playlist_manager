import { FastifyInstance } from "fastify";
import { authApiResponse } from "@shared/types";
import axios from "axios";
import { config } from "dotenv";

config();

const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || "";
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const SPOTIFY_CLIENT_SECRET = encodeURIComponent(
  process.env.SPOTIFY_CLIENT_SECRET || ""
);

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_AUTH_URL_AUTHORIZE = "https://accounts.spotify.com/authorize";

const SCOPES = [
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public",
  "user-library-read",
  "user-read-recently-played",
  "user-top-read",
].join(" ");

export async function authRoutes(fastify: FastifyInstance) {
  // 1. Redirect to Spotify Auth
  fastify.get("/login", async (request, reply) => {
    const state = Math.random().toString(36).substring(2, 15); // Generate a random state string
    const authUrl = `${SPOTIFY_AUTH_URL_AUTHORIZE}?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      SPOTIFY_REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES)}&state=${state}`;
    fastify.log.info("Redirecting to Spotify Auth URL");
    reply.redirect(authUrl);
  });

  // 2. Handle Spotify Callback
  fastify.get("/callback", async (request, reply) => {
    const { code } = request.query as { code: string };
    try {
      const response = await axios.post(SPOTIFY_AUTH_URL, null, {
        params: {
          grant_type: "authorization_code",
          code,
          redirect_uri: SPOTIFY_REDIRECT_URI,
          client_id: SPOTIFY_CLIENT_ID,
          client_secret: SPOTIFY_CLIENT_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const { access_token, refresh_token, expires_in } = response.data;
      // Store tokens in session or database as needed

      const html_response = `
      <html>
        <head>
          <script>
            window.opener.postMessage({
              type: 'spotify-auth-success',
              payload: {
                access_token: '${access_token}',
                refresh_token: '${refresh_token}',
                expires_in: ${expires_in},
              },
            }, '*');
            window.close();
          </script>
        </head>
        <body>Authentication successful! You can close this window.</body>
      </html>
    `;

      fastify.log.info(`Spotify authentication successful: \n${access_token}`);
      reply.type("text/html").send(html_response);
    } catch (error) {
      fastify.log.error("Error during Spotify authentication:", error);
      reply.status(500).send("Authentication failed");
    }
  });

  // 3. Refresh Access Token
  fastify.post("/refresh", async (request, reply) => {
    const { refresh_token } = request.body as { refresh_token: string };

    try {
      const response = await axios.post(SPOTIFY_AUTH_URL, null, {
        params: {
          grant_type: "refresh_token",
          refresh_token,
          client_id: SPOTIFY_CLIENT_ID,
          client_secret: SPOTIFY_CLIENT_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, expires_in } = response.data;
      reply.send({ access_token, expires_in });
    } catch (error) {
      console.error("Error refreshing token:", error);
      reply.status(500).send({ error: "Token refresh failed" });
    }
  });
}
