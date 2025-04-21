import { Row, Col, Form, Button } from "react-bootstrap";
import { useState, ChangeEvent } from "react";
import { ItemAttributes } from "./Item";

interface AggregateProps {
  addItem: (item: ItemAttributes) => void;
}

const defaultNewItem = { name: "", description: "", image: "", rating: 1 };

const Aggregate: React.FC<AggregateProps> = ({ addItem }) => {
  // Local state for new item
  const [newItem, setNewItem] = useState<ItemAttributes>(defaultNewItem);

  const handleNewItemChange = (
    field: keyof ItemAttributes,
    value: string | number
  ) => {
    setNewItem({ ...newItem, [field]: value });
  };

  return (
    <Row className="mb-4">
      <Col>
        <h4>Add New Item</h4>
        <Form>
          <Row>
            <Col md>
              <Form.Control
                placeholder="Name"
                value={newItem.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleNewItemChange("name", e.target.value)
                }
                className="mb-2"
              />
            </Col>
            <Col md>
              <Form.Control
                placeholder="Description"
                value={newItem.description}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleNewItemChange("description", e.target.value)
                }
                className="mb-2"
              />
            </Col>
            <Col md>
              <Form.Control
                placeholder="Image URL"
                value={newItem.image}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleNewItemChange("image", e.target.value)
                }
                className="mb-2"
              />
            </Col>
            <Col md>
              <Form.Select
                value={newItem.rating}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  handleNewItemChange("rating", Number(e.target.value))
                }
                className="mb-2"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Button
              onClick={(e) => {
                e.preventDefault();
                addItem(newItem);
                setNewItem(defaultNewItem);
              }}
            >
              Add Item
            </Button>
            <Col md></Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default Aggregate;
