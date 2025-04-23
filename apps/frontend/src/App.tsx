// React + styling
import { useEffect, useState } from "react";
import { Selector, Item, Aggregate, Filter } from "./components";
import { Container, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// Types
import { addedItem, ItemAttributes } from "@shared/types";
import {
  fetchPlaylistItems,
  addTrackToPlaylist,
  deleteTrackFromPlaylist,
} from "./services";

export default function App() {
  // Global state
  const [playlist, setPlaylist] = useState<string>("");
  const [items, setItems] = useState<ItemAttributes[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");

  // Load items on playlist change
  useEffect(() => {
    const getItems = async () => {
      const storedItems = localStorage.getItem(playlist);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      } else {
        if (playlist == "0") return;
        // If no playlist items cached fetch them
        const playlistItems = await fetchPlaylistItems(playlist);
        setItems(playlistItems);
        localStorage.setItem(playlist, JSON.stringify(playlistItems));
      }
    };

    if (playlist) {
      getItems();
    }
  }, [playlist, setPlaylist]);

  const filteredItems = [...items]
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const addItem = (newItem: addedItem) => {
    localStorage.removeItem(playlist);
    const addTrack = async (playlist_id: string, uri: string) => {
      await addTrackToPlaylist(playlist_id, uri);
      const playlistItems = await fetchPlaylistItems(playlist);
      setItems(playlistItems);
      localStorage.setItem(playlist, JSON.stringify(playlistItems));
    };
    addTrack(playlist, newItem.uri);
  };

  const deleteItems = (id: string) => {
    localStorage.removeItem(playlist);
    const deleteTrack = async (playlist_id: string, uri: string) => {
      await deleteTrackFromPlaylist(playlist_id, uri);
      const playlistItems = await fetchPlaylistItems(playlist);
      setItems(playlistItems);
      localStorage.setItem(playlist, JSON.stringify(playlistItems));
    };
    deleteTrack(playlist, id);
  };

  return (
    <Container className="my-4">
      <Selector playlist={playlist} changePlaylist={setPlaylist} />
      <Filter
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <Aggregate addItem={addItem} />
      <Row>
        {filteredItems.map((item) => (
          <Item
            key={item.id}
            id={item.id} // Maybe a better way to handle this
            attributes={item}
            updateRating={(id: string, rating: number) => {
              setItems(
                items.map((i) =>
                  i.id === id ? { ...i, rating: Number(rating) } : i
                )
              );
            }}
            deleteItems={(id: string) => {
              console.log(id);
              deleteItems(id);
            }}
          />
        ))}
      </Row>
    </Container>
  );
}
