import React from 'react'

class Card extends React.Component {
  constructor(props) {
    super();
    this.state = {
      value: props.value,
      onClick: props.onClick,
      selected: props.selected,
      solved: props.solved,
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      selected: props.selected,
      solved: props.solved,
    };
  }

  render() {
    return (
      <div onClick={this.state.onClick} className={this.state.solved ? "card solved" : "card"}>
        <img
          src={this.state.selected || this.state.solved ? require("./img/card" + this.state.value + ".png") : require("./img/card0.png")}
          alt={this.state.selected || this.state.solved ? this.state.value : "?"}
        />
      </div>
    )
  }
}

export default Card;