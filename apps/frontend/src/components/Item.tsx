import { Col, Card, Button, Form } from "react-bootstrap";
import { ChangeEvent } from "react";
import { ItemProps } from "@shared/types";

export const Item: React.FC<ItemProps> = ({
  id,
  attributes: { name, description, image, rating },
  updateRating,
  deleteItems,
}) => {
  return (
    <Col md={4} className="mb-4">
      <Card>
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{description}</Card.Text>
          <Form.Select
            value={rating}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              updateRating(id, Number(e.target.value))
            }
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Form.Select>
          <Button
            variant="danger"
            className="mt-2"
            onClick={() => deleteItems(id)}
          >
            Delete
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Item;
