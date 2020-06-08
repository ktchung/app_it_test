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
      <div onClick={this.state.onClick}>
        {this.state.selected || this.state.solved ? this.state.value : "?"} {this.state.solved ? "ok" : ""}
      </div>
    )
  }
}

export default Card;