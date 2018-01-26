import React, { Component } from 'react';
import toBe from 'prop-types';

export default class ClassicCounter extends React.Component {
  // static propTypes = {
  //   value: toBe.number,
  // };
  //
  // static defaultProps = {
  //   value: 0,
  // };

  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };

    this.handleDec = this.handleDec.bind(this);
    this.handleInc = this.handleInc.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value || nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleDec() {
    this.setState((state) => ({
      value: state.value - 1,
    }));
  }

  handleInc() {
    this.setState((state) => ({
      value: state.value + 1,
    }));
  }

  render() {
    const { value } = this.state;

    return (
      <div>
        <button onClick={this.handleDec}>-1</button>
        {value}
        <button onClick={this.handleInc}>+1</button>
      </div>
    );
  }
}
