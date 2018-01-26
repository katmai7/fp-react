import React from 'react';
import test from 'ava';
import Enzyme, { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';

import component from '../../src';

Enzyme.configure({ adapter: new Adapter() });

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
  if (nextProps.value !== self.props.value || nextProps.value !== self.state.value) {
    reduce({
      type: 'setValue',
      payload: { value: nextProps.value },
    });
  }
});

const shouldUpdate = sinon.spy((nextProps, nextState, self) => {
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

const renderComponent = (useMount = true) => {
  const render = useMount ? mount : shallow;
  return render(<TestedComponent
    value={10}
  />);
};

test.afterEach.always('reset spies history', t => {
  Object.keys(CDO).forEach(key => CDO[key].resetHistory && CDO[key].resetHistory());
});

test('should component created with initial props correctly', t => {
  renderComponent();

  t.true(initialState.calledOnce);
  t.is(initialState.firstCall.args[0].value, 10);
});

test('should call willReceiveProps', t => {
  const component = renderComponent();
  t.is(component.props().value, 10);
  t.is(component.state().value, 10);

  component.setProps({ value: 5 });

  t.true(willReceiveProps.calledOnce);
  t.is(willReceiveProps.firstCall.args[0].value, 5); // nextProps
  // TODO check that current props and state is correct
  t.is(typeof willReceiveProps.firstCall.args[2], 'function');
});

test('should call render', t => {
  renderComponent();

  t.true(render.calledOnce);
  t.is(render.firstCall.args[0].props.value, 10);
  t.is(render.firstCall.args[0].state.value, 10);
  t.is(typeof render.firstCall.args[1], 'function');
});

test.todo('should call shouldUpdate');
test.todo('should call didUpdate');

test('should call willMount', t => {
  renderComponent(true);

  t.true(willMount.calledOnce);
  t.is(willMount.firstCall.args[0].props.value, 10);
  t.is(willMount.firstCall.args[0].state.value, 10);
});

test('should call didMount', t => {
  renderComponent(true);

  t.true(didMount.calledOnce);
  t.is(didMount.firstCall.args[0].props.value, 10);
  t.is(didMount.firstCall.args[0].state.value, 10);
  t.is(typeof didMount.firstCall.args[1], 'function');
});

test('should call willUnmount', t => {
  const component = renderComponent(true);
  component.unmount();

  t.true(willUnmount.calledOnce);
  t.is(willUnmount.firstCall.args[0].props.value, 10);
  t.is(willUnmount.firstCall.args[0].state.value, 10);
});