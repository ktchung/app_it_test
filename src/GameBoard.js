import React from 'react';
import Card from './Card.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class GameBoard extends React.Component {
  constructor(props) {
    super();
    var cardList = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
    this.state = {
      score: 0,
      firstCard: undefined,
      secondCard: undefined,
      cardList: shuffleArray(cardList),
      solvedList: [],
      onFinish: props.onFinish,
      modalShow: false,
    };
  }
  render() {
    // console.log(this.state.cardList);
    var cards = this.state.cardList.map((value, index) => {
      return ([
          <div className="col">
            <Card
              key={index}
              value={value}
              onClick={() => this.handleCardClick(index)}
              selected={index === this.state.firstCard || index === this.state.secondCard}
              solved={this.state.solvedList.indexOf(index) !== -1}
            />
          </div>,
          (index + 1) % 4 === 0 ? <div className="w-100" /> : undefined
        ]);
      }
    )
    // console.log("cards:", cards);
    return (
      <div>
        <div className="score">Score: {this.state.score}</div>
        <div class="container">
          <div class="row">
            {cards}
          </div>
        </div>
        <FinishedModal
          show={this.state.modalShow}
          onHide={this.state.onFinish}
          onHide2={() => {this.setState({modalShow: false,})}}
          score={this.state.score}
          className="finishedModal"
        />
      </div>
    );
  }

  handleCardClick(key) {
    console.log("Clicked", key);
    if (this.state.solvedList.indexOf(key) !== -1) {
      console.log("Solved");
      return;
    }
    if (this.state.firstCard === undefined) {
      this.setState({
        firstCard: key
      });
    } else if (this.state.secondCard === undefined && this.state.firstCard !== key) {
      this.setState({
        secondCard: key
      });
      setTimeout(() => {this.checkPair()}, 1000);
    }
  }

  checkPair() {
    console.log("Pair:", this.state.firstCard, this.state.secondCard);
    if (this.state.cardList[this.state.firstCard] === this.state.cardList[this.state.secondCard]) {
      console.log("Correct!");
      this.setState((prev) => ({
        solvedList: [...prev.solvedList, prev.firstCard, prev.secondCard],
        score: prev.score + 5,
      }));
    } else {
      console.log("Incorrect!");
      this.setState((prev) => ({
        score: prev.score - 1,
      }));
    }
    this.setState({
      firstCard: undefined,
      secondCard: undefined,
    });

    if (this.state.solvedList.length === this.state.cardList.length) {
      console.log("Finished");
      this.setState({
        modalShow: true,
      });
    }
  }
}

const FinishedModal = (props) => {
  var nameInput = React.createRef();
  const [isInvalid, setIsInvalid] = React.useState(false);
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="container-modal-title-vcenter"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Your score: {props.score}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Name"
              ref={nameInput}
            />
          </Form.Group>
          {isInvalid ? "Invalid Name!" : ""}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            if (validateName(nameInput.current.value)) {
              setIsInvalid(false);
              props.onHide(nameInput.current.value, props.score);
              props.onHide2();
            } else {
              setIsInvalid(true);
            }
          }}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function validateName(name) {
  return /^[a-z0-9]+$/i.test(name);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default GameBoard;