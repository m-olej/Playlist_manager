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
      const { access_token, refresh_token } = response.data;
      // Store tokens in session or database as needed
      reply.send({ access_token, refresh_token } as authApiResponse);
    } catch (error) {
      console.error("Error during Spotify authentication:", error);
      reply.status(500).send("Authentication failed");
    }
  });
}
