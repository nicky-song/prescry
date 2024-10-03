// Copyright 2018 Prescryptive Health, Inc.

import {
  applyMiddleware,
  compose,
  createStore,
  Middleware,
  Reducer,
} from 'redux';

import thunk from 'redux-thunk';

// note: window doesnt exist in react-native, so this should always be used with (window && window....)
// eslint-disable-next-line no-var
declare var window: {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: <R>(a: R) => R;
};

const composeEnhancers =
  (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export function configureStore<TRootReducer extends Reducer, TInitialState>(
  rootReducer: TRootReducer,
  initialState?: TInitialState,
  middlewares: Middleware[] = []
) {
  middlewares.unshift(thunk);

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  return createStore(rootReducer, initialState, enhancer);
}
