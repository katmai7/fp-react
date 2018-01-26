import React from 'react';

import component from './f-react';

const initialState = (props) => ({ value: 0 });

export const reducer = () => {
  return {
    increment: (state) => ({ ...state, value: state.value + 1 }),
    decrement: (state) => ({ ...state, value: state.value - 1 }),
    setValue: (state, { value }) => ({ ...state, value }),
  };
};

export const didMount = (props, state, reduce) => {};

export const willReceiveProps = (nextProps, self, reduce) => {
  if (nextProps.value !== self.props.value || nextProps.value !== self.state.value) {
    reduce({
      type: 'setValue',
      payload: { value: nextProps.value },
    });
  }
};

export const shouldUpdate = (nextProps, nextState, self) => {
  return nextProps.value !== self.props.value || nextState.value !== self.state.value;
};

export const willUpdate = (nextProps, nextState, self, reduce) => {};

export const didUpdate = (prevProps, prevState, self, reduce) => {};

export const willUnmount = (self) => {};

export const handleDec = (e, self, reduce) => {
  reduce({ type: 'decrement' });
};

export const handleInc = (e, self, reduce) => {
  reduce({ type: 'increment' });
};

export const render = (self, handle) => {
  return (
    <div>
      <button onClick={handle(handleDec)}>-1</button>
      {self.state.value}
      <button onClick={handle(handleInc)}>+1</button>
    </div>
  );
};

export default component({
  displayName: 'FunctionalComponent',
  initialState,
  reducer,
  render,
  didMount,
  willReceiveProps,
  shouldUpdate,
  willUpdate,
  didUpdate,
  willUnmount,
});