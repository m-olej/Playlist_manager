import { FastifyInstance } from "fastify";
import axios from "axios";
import {
  apiRequest,
  playlistApiResponse,
  playlistsRequest,
} from "@shared/types";

export async function playlistsRoutes(fastify: FastifyInstance) {
  // Get user's playlists
  fastify.post("/playlists", async (request, reply) => {
    const { access_token, limit } = request.body as playlistsRequest;

    fastify.log.info(JSON.stringify(request.body, null, 2));

    const url = `https://api.spotify.com/v1/me/playlists?limit=${limit}`;
    const auth = `Bearer ${access_token}`;

    fastify.log.info(`url: ${url}`);
    fastify.log.info(`Authorization: ${auth}`);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: auth,
        },
      });
      fastify.log.info("Fetched user playlists successfully");

      // Transform response data if needed
      // const playlists: playlistApiResponse[] = response.data.items.map(
      //   (item: any) => ({
      //     id: item.id,
      //     name: item.name,
      //   })
      // );

      // fastify.log.info("Transformed playlists: ", playlists);

      reply.send(response.data.items);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        fastify.log.error(
          `Spotify error response: ${JSON.stringify(
            error.response.data,
            null,
            2
          )}`
        );
        fastify.log.error(`Status: ${error.response.status}`);
        fastify.log.error(`Headers: ${error.response.headers}`);
      } else {
        fastify.log.error(`Error fetching user playlists: ${error}`);
      }
      reply.status(500).send({ error: "Failed to fetch playlists" });
    }
  });

  // Get playlist items
  fastify.post("/playlists/:playlist_id", async (request, reply) => {
    {
      const { access_token } = request.body as apiRequest;
      const { playlist_id } = request.params as { playlist_id: string };

      fastify.log.info(JSON.stringify({ access_token, playlist_id }, null, 2));

      const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
      const auth = `Bearer ${access_token}`;

      fastify.log.info(`url: ${url}`);
      fastify.log.info(`Authorization: ${auth}`);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: auth,
          },
        });
        fastify.log.info("Fetched playlist items successfully");

        // Transform response data
        const playlistItems = response.data.items.map((item: any) => ({
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists.map((artist: any) => artist.name),
          length: item.track.duration_ms,
          album: {
            name: item.track.album.name,
            type: item.track.album.album_type,
            release: item.track.album.release_date,
            images: item.track.album.images,
          },
        }));

        reply.send(playlistItems as playlistApiResponse[]);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          fastify.log.error(
            `Spotify error response: ${JSON.stringify(
              error.response.data,
              null,
              2
            )}`
          );
          fastify.log.error(`Status: ${error.response.status}`);
          fastify.log.error(`Headers: ${error.response.headers}`);
        } else {
          fastify.log.error(`Error fetching playlist items: ${error}`);
        }
        reply.status(500).send({ error: "Failed to fetch playlist items" });
      }
    }
  });

  // Add a track to a playlist
  fastify.post("/playlists/:playlist_id/add", async (request, reply) => {
    const { access_token } = request.body as apiRequest;
    const { playlist_id } = request.params as { playlist_id: string };
    const { track_uri } = request.body as { track_uri: string };

    fastify.log.info(
      JSON.stringify({ access_token, playlist_id, track_uri }, null, 2)
    );

    const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
    const auth = `Bearer ${access_token}`;

    fastify.log.info(`url: ${url}`);
    fastify.log.info(`Authorization: ${auth}`);
    try {
      const response = await axios.post(
        url,
        {
          uris: [track_uri],
        },
        {
          headers: {
            Authorization: auth,
            "Content-Type": "application/json",
          },
        }
      );
      fastify.log.info("Added track to playlist successfully");
      reply.send(response.status);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        fastify.log.error(
          `Spotify error response: ${JSON.stringify(
            error.response.data,
            null,
            2
          )}`
        );
        fastify.log.error(`Status: ${error.response.status}`);
        fastify.log.error(`Headers: ${error.response.headers}`);
      } else {
        fastify.log.error(`Error adding track to playlist: ${error}`);
      }
      reply.status(500).send({ error: "Failed to add track to playlist" });
    }
  });

  // delete a track from a playlist
  fastify.post("/playlists/:playlist_id/delete", async (request, reply) => {
    const { access_token } = request.body as apiRequest;
    const { playlist_id } = request.params as { playlist_id: string };
    const { track_uri } = request.body as { track_uri: string };

    fastify.log.info(
      JSON.stringify({ access_token, playlist_id, track_uri }, null, 2)
    );

    const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
    const auth = `Bearer ${access_token}`;

    fastify.log.info(`url: ${url}`);
    fastify.log.info(`Authorization: ${auth}`);
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        data: {
          tracks: [{ uri: `spotify:track:${track_uri}` }],
        },
      });
      fastify.log.info("Deleted track from playlist successfully");
      reply.send(response.status);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        fastify.log.error(
          `Spotify error response: ${JSON.stringify(
            error.response.data,
            null,
            2
          )}`
        );
        fastify.log.error(`Status: ${error.response.status}`);
        fastify.log.error(`Headers: ${error.response.headers}`);
      } else {
        fastify.log.error(`Error deleting track from playlist: ${error}`);
      }
      reply.status(500).send({ error: "Failed to delete track from playlist" });
    }
  });
}
