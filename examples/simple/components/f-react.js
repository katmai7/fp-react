import React from 'react';
import deepFreeze from 'deep-freeze';

const nullFunc = () => null;

function component(definitionObject) {
  const {
    initialState,
    defaultProps = nullFunc,
    propTypes = nullFunc,
    displayName,
    reducer,
    willMount,
    render,
    didMount,
    willReceiveProps,
    shouldUpdate,
    willUpdate,
    didUpdate,
    willUnmount,
  } = definitionObject;

  // calls on every render
  let self = {};
  let reduce;
  const handle = (fn) => (...args) => fn(...args, self, reduce);

  class WrapComponent extends React.Component {
    static propTypes = propTypes();
    static defaultProps = defaultProps();
    static displayName = displayName;

    constructor(props, context) {
      super(props, context);

      if (initialState) {
        const state = initialState(props);
        this.state = state;
        self.state = state;
      }
      self.props = props;

      this.reducer = reducer();

      reduce = ({ type, payload }) => {
        const actionFn = this.reducer[type];
        let newState = actionFn
          ? actionFn(self.state, payload)
          : self.state;

        if (process.env.NODE_ENV !== 'production') {
          newState = deepFreeze(newState);
        }

        this.setState(newState);
      };
    }
  }

  if (willMount) {
    WrapComponent.prototype.componentWillMount = function () {
      willMount(self);
    };
  }

  if (didMount) {
    WrapComponent.prototype.componentDidMount = function () {
      didMount(self, reduce);
    };
  }

  if (willReceiveProps) {
    WrapComponent.prototype.componentWillReceiveProps = function (nextProps) {
      willReceiveProps(nextProps, self, reduce);
    };
  }

  if (willUpdate) {
    WrapComponent.prototype.componentWillUpdate = function (nextProps, nextState) {
      willUpdate(nextProps, nextState, self, reduce);
    };
  }

  if (shouldUpdate) {
    WrapComponent.prototype.shouldComponentUpdate = function (nextProps, nextState) {
      const res = shouldUpdate(nextProps, nextState, self);
      self.state = nextState;
      self.props = nextProps;

      return res;
    };
  }

  if (didUpdate) {
    WrapComponent.prototype.componentDidUpdate = function (prevProps, prevState) {
      didUpdate(prevProps, prevState, self, reduce);
    };
  }

  if (willUnmount) {
    WrapComponent.prototype.componentWillUnmount = function () {
      willUnmount(self);
    };
  }

  WrapComponent.prototype.render = function () {
    return render(self, handle, reduce);
  };

  // TODO componentDidCatch

  return WrapComponent;
}

export default component;