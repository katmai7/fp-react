import React from 'react';
import test from 'ava';
import Enzyme, { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import _ from 'lodash/fp';

import component from '../../src';

Enzyme.configure({ adapter: new Adapter() });

let wrpCurrentSelf = null;
let suCurrentSelf = null;

const initialState = sinon.spy(({ value = 0 }) => ({ value }));

const reducer = sinon.spy(() => {
  return {
    increment: (state) => ({ ...state, value: state.value + 1 }),
    decrement: (state) => ({ ...state, value: state.value - 1 }),
    setValue: (state, { value }) => ({ ...state, value }),
  };
});

const willMount = sinon.spy((self) => {});

const didMount = sinon.spy((self, reduce) => {});

const willReceiveProps = sinon.spy((nextProps, self, reduce) => {
  wrpCurrentSelf = _.cloneDeep(self);

  if (nextProps.value !== self.props.value || nextProps.value !== self.state.value) {
    reduce({
      type: 'setValue',
      payload: { value: nextProps.value },
    });
  }
});

const shouldUpdate = sinon.spy((nextProps, nextState, self) => {
  suCurrentSelf = _.cloneDeep(self);

  return nextProps.value !== self.props.value || nextState.value !== self.state.value;
});

const willUpdate = sinon.spy((nextProps, nextState, self, reduce) => {});

const didUpdate = sinon.spy((prevProps, prevState, self, reduce) => {});

const willUnmount = sinon.spy((self) => {});

const handleDec = sinon.spy((e, self, reduce) => {
  reduce({ type: 'decrement' });
});

const handleInc = sinon.spy((e, self, reduce) => {
  reduce({ type: 'increment' });
});

const render = sinon.spy((self, handle) => {
  return (
    <div>
      <button onClick={handle(handleDec)}>-1</button>
      {self.state.value}
      <button onClick={handle(handleInc)}>+1</button>
    </div>
  );
});

// component definition object
const CDO = {
  displayName: 'FunctionalComponent',
  initialState,
  reducer,
  willMount,
  willReceiveProps,
  shouldUpdate,
  willUpdate,
  render,
  didMount,
  didUpdate,
  willUnmount,
};

const TestedComponent = component(CDO);

const renderComponent = () => {
  return shallow(<TestedComponent
    value={10}
  />);
};

test.afterEach.always('reset spies history', t => {
  Object.keys(CDO).forEach(key => CDO[key].resetHistory && CDO[key].resetHistory());
  wrpCurrentSelf = null;
  suCurrentSelf = null;
});

test('should component created with initial props correctly', t => {
  renderComponent();

  t.true(initialState.calledOnce);
  t.is(initialState.firstCall.args[0].value, 10);
});

test('should call willMount', t => {
  renderComponent();

  t.true(willMount.calledOnce);
  t.is(willMount.firstCall.args[0].props.value, 10);
  t.is(willMount.firstCall.args[0].state.value, 10);
});

test('should call render', t => {
  renderComponent();

  t.true(render.calledOnce);
  t.is(render.firstCall.args[0].props.value, 10);
  t.is(render.firstCall.args[0].state.value, 10);
  t.is(typeof render.firstCall.args[1], 'function');
});

test('should call didMount', t => {
  renderComponent(true);

  t.true(didMount.calledOnce);
  t.is(didMount.firstCall.args[0].props.value, 10);
  t.is(didMount.firstCall.args[0].state.value, 10);
  t.is(typeof didMount.firstCall.args[1], 'function');
});

test('should call willReceiveProps', t => {
  const component = renderComponent();
  const instance = component.instance();
  t.is(instance.props.value, 10);
  t.is(instance.state.value, 10);

  component.setProps({ value: 5 });

  t.true(willReceiveProps.calledOnce);
  t.is(willReceiveProps.firstCall.args[0].value, 5); // nextProps
  t.is(typeof willReceiveProps.firstCall.args[2], 'function');

  // check that willReceiveProps receives previous props/state
  t.is(wrpCurrentSelf.props.value, 10);
  t.is(wrpCurrentSelf.state.value, 10);

  // check that props/state are updated
  t.is(instance.props.value, 5);
  t.is(instance.state.value, 5);
});

test('should call shouldUpdate', t => {
  const component = renderComponent();

  t.true(shouldUpdate.notCalled);

  component.setState({ value: 5 }); // TODO rewrite to button click

  t.true(shouldUpdate.calledOnce);

  // check that shouldUpdate receives previous props/state
  t.is(suCurrentSelf.props.value, 10);
  t.is(suCurrentSelf.state.value, 10);
});

test.todo('should call didUpdate');

test('should call willUnmount', t => {
  const component = renderComponent();
  component.unmount();

  t.true(willUnmount.calledOnce);
  t.is(willUnmount.firstCall.args[0].props.value, 10);
  t.is(willUnmount.firstCall.args[0].state.value, 10);
});