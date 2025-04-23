import { Row, Col, Form, Button } from "react-bootstrap";
import { useState, ChangeEvent } from "react";
import { addedItem } from "@shared/types";

interface AggregateProps {
  addItem: (item: addedItem) => void;
}

const defaultNewItem = { uri: "URI" };

const Aggregate: React.FC<AggregateProps> = ({ addItem }) => {
  // Local state for new item
  const [newItem, setNewItem] = useState<addedItem>(defaultNewItem);

  const handleNewItemChange = (field: keyof addedItem, value: string) => {
    setNewItem({ ...newItem, [field]: value });
  };

  return (
    <Row className="mb-4">
      <Col>
        <h4>Add New Item</h4>
        <Form>
          <Row>
            <Form.Control
              value={newItem.uri}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleNewItemChange("uri", e.target.value)
              }
              className="mb-2"
            />
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
