import { useState, useEffect } from "react";
import { Selector, Item, Aggregate, Filter } from "./components";
import { Container, Row } from "react-bootstrap";
import { ItemAttributes } from "./components/Item";
import { ItemType } from "@shared/types";
import { authorize } from "./services/SpotifyApi";
import "bootstrap/dist/css/bootstrap.min.css";

const initialItems: ItemType[] = [
  {
    id: 1,
    name: "Item 1",
    description: "First item description",
    image: "https://via.placeholder.com/150",
    rating: 4,
  },
];

export default function App() {
  // Authorize spotify access only on first render
  useEffect(() => {
    const authorizeSpotify = async () => {
      try {
        await authorize();
      } catch (error) {
        console.error("Error authorizing Spotify:", error);
      }
    };

    authorizeSpotify();
  }, []);

  // Global state
  const [playlist, setPlaylist] = useState<string | number>("");
  const [items, setItems] = useState<ItemType[]>(initialItems);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");

  const filteredItems = [...items]
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const addItem = (newItem: ItemAttributes) => {
    setItems([
      ...items,
      { ...newItem, id: items.length ? items[items.length - 1].id + 1 : 1 },
    ]);
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
            updateRating={(id: number, rating: number) => {
              setItems(
                items.map((i) =>
                  i.id === id ? { ...i, rating: Number(rating) } : i
                )
              );
            }}
            deleteItems={(id: number) => {
              setItems(items.filter((i) => i.id !== id));
            }}
          />
        ))}
      </Row>
    </Container>
  );
}
