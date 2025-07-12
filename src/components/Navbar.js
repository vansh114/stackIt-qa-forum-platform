import { useContext, useState } from "react";
import { Navbar, Container, Form, Button, NavDropdown } from "react-bootstrap";
import { QuestionContext } from "../context/QuestionContext";
import { Link, useNavigate } from "react-router-dom";

const CustomNavbar = () => {
  const { filters, setFilters } = useContext(QuestionContext);
  const [query, setQuery] = useState(filters.search || "");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: query });
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          StackIt
        </Navbar.Brand>
        <Form className="d-flex me-auto" onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Search questions..."
            className="me-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" variant="outline-primary">
            Search
          </Button>
        </Form>
        <NavDropdown title="Sort By" id="nav-dropdown">
          <NavDropdown.Item
            onClick={() => setFilters({ ...filters, sort: "newest" })}
          >
            Newest
          </NavDropdown.Item>
          <NavDropdown.Item
            onClick={() => setFilters({ ...filters, unanswered: true })}
          >
            Unanswered
          </NavDropdown.Item>
        </NavDropdown>
        <Button as={Link} to="/ask" variant="primary" className="ms-2">
          Ask New Question
        </Button>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
