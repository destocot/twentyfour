import { useState } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { parseMath, checkValid, evaluateMath } from "./helpers/parseMath";
import toast, { Toaster } from "react-hot-toast";

const randomNumbers = [
  Math.floor(Math.random() * (9 - 1) + 1),
  Math.floor(Math.random() * (9 - 1) + 1),
  Math.floor(Math.random() * (9 - 1) + 1),
  Math.floor(Math.random() * (9 - 1) + 1),
];

function App() {
  const [game, setGame] = useState(false);
  const [attempt, setAttempt] = useState("");
  const [numbers, setNumbers] = useState(randomNumbers);
  const [cards, setCards] = useState(true);
  const [query, setQuery] = useState("");
  const [streak, setStreak] = useState(0);

  const newNumbers = () => {
    const num1 = Math.floor(Math.random() * (9 - 1) + 1);
    const num2 = Math.floor(Math.random() * (9 - 1) + 1);
    const num3 = Math.floor(Math.random() * (9 - 1) + 1);
    const num4 = Math.floor(Math.random() * (9 - 1) + 1);
    setNumbers([num1, num2, num3, num4]);
    // setNumbers([1, 1, 8, 1]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.clear();
    const parsed = parseMath(query);
    const isValidAttempt = checkValid(parsed, numbers);
    if (!isValidAttempt) {
      toast.error("each number must be used once");
      return;
    }
    const evaluated = evaluateMath(parsed);
    if (evaluated === 24) {
      toast.success("congratulations, you are correct!", { duration: 500 });
      setCards(false);
      setQuery("");
      setTimeout(() => {
        toast("loading new game...", { duration: 2000 });
      }, 500);

      setTimeout(() => {
        setCards(false);
        newNumbers();
        setAttempt("");
        setStreak((state) => state + 1);
        setCards(true);
      }, 2000);
    } else {
      toast.error("incorrect solution, try again");
    }

    setAttempt(evaluated);
  };

  return (
    <Container className="App">
      <Toaster />
      {!game && (
        <Button variant="primary" onClick={() => setGame(true)}>
          Click Here To Play
        </Button>
      )}
      {game && (
        <>
          <h1 className="heading text-white">Welcome, to 24!</h1>

          {streak > 0 && <h5 className="streak">streak: {streak}</h5>}
          {cards && (
            <Row>
              <Col>
                <Card className="py-5">
                  <Card.Body>
                    <Card.Text>
                      <span className="h1">{numbers[0]}</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="py-5">
                  <Card.Body>
                    <Card.Text>
                      <span className="h1">{numbers[1]}</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="py-5">
                  <Card.Body>
                    <Card.Text>
                      <span className="h1">{numbers[2]}</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="py-5">
                  <Card.Body>
                    <Card.Text>
                      <span className="h1">{numbers[3]}</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
          <Form className="my-2" onSubmit={(e) => submitHandler(e)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Enter your solution"
              />
            </Form.Group>
            <Button className="mx-1" variant="primary" type="submit">
              Submit
            </Button>
            <Button
              className="mx-1"
              variant="secondary"
              type="button"
              onClick={() => {
                setCards(false);
                newNumbers();
                setQuery("");
                setAttempt("");
                setTimeout(() => {
                  setCards(true);
                }, 1);
              }}
            >
              New Game
            </Button>
          </Form>
          <Card className="lead bg-white my-1">attempt: {attempt}</Card>
          <Card className="instructions" style={{ width: "45rem" }}>
            <Card.Body>
              <Card.Title>Instructions: </Card.Title>
              <Card.Text>
                Using, the numbers above, use math operations to make the number
                24, you must use each number and only once. The only operations
                you can use are &apos;+&apos;, &apos;-&apos;, &apos;*&apos;, and
                &apos;/&apos;.
              </Card.Text>
              <Card.Text>
                Some numbers may have multiple solutions, while others might
                have no solutions at all. Feel free, to refresh the page to get
                a new set of numbers.
              </Card.Text>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
}

export default App;
