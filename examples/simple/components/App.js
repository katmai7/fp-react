import React, { Component } from 'react';

import ClassicCounter from './ClassicCounter';
import FunctionalCounter from './FunctionalCounter';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      classicValue: 0,
      funcValue: 0,
    };

    this.handleBtnClick = this.handleBtnClick.bind(this);
  }

  handleBtnClick() {
    this.setState({
      classicValue: 100,
      funcValue: 100,
    });
  }

  render() {
    const { classicValue, funcValue } = this.state;

    return (
      <div>
        <button onClick={this.handleBtnClick}>Set to 100</button>
        <ClassicCounter value={classicValue} />
        <FunctionalCounter value={funcValue} />
      </div>
    );
  }
}
