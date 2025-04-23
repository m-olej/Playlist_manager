import { Row, Col, Card, Button, Form } from "react-bootstrap";
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
          <Row className="d-flex align-items-center justify-content-between">
            <Form.Label className="ml-0 w-50">Rating:</Form.Label>
            <Form.Select
              className="w-25"
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
          </Row>
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
