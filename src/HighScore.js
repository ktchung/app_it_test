import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

class HighScore extends React.Component {
  constructor(props) {
    super();
    this.state = {
      modalShow: false,
      data: props.data,
      testData: [{name: "A", score: 40}, {name: "B", score: 30}, {name: "C", score: 20}],
    };
  }
  static getDerivedStateFromProps(props, state) {
    return {
      data: props.data,
    };
  }
  render () {
    // console.log(this.state.data);
    return (
      <div>
        <Button className="highScore" onClick={() => this.setState({modalShow: true,})}>
          High Score
        </Button>
        <HighScoreModal
          show={this.state.modalShow}
          onHide={() => this.setState({
            modalShow: false,
          })}
          className="highScoreModal"
          data={this.state.data === undefined || this.state.data.length !== 1 ? undefined : this.state.data[0].values}
        />
      </div>
    );
  }
}

const HighScoreModal = (props) => {
  // console.log(props.data);
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="container-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          High Score
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table hover bordered striped>
          <thead>
            <tr><th>Rank</th><th>Name</th><th>Score</th></tr>
          </thead>
          <tbody>
            {
              props.data === undefined ? <tr><td /><td>No Data</td><td /></tr> :
              props.data.map((entry, id) =>
                <tr key={id}>
                  <td>{id + 1}</td>
                  <td>{entry[0]}</td>
                  <td>{entry[1]}</td>
                </tr>
              )
            }
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

export default HighScore;