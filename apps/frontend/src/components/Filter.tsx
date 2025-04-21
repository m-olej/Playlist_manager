import { ChangeEvent } from "react";
import { Col, Row, Form, InputGroup } from "react-bootstrap";

interface FilterProps {
  search: string;
  setSearch: (search: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

const Filter = (props: FilterProps) => {
  return (
    <Row className="mb-3">
      <Col md={6}>
        <InputGroup>
          <Form.Control
            placeholder="Search..."
            value={props.search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              props.setSearch(e.target.value)
            }
          />
        </InputGroup>
      </Col>
      <Col md={3}>
        <Form.Select
          value={props.sortBy}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            props.setSortBy(e.target.value)
          }
        >
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default Filter;
