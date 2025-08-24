import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

function* rootSaga() {}

export function getStore() {
  const saga = createSagaMiddleware();
  const rootReducer = combineReducers({
    router: connectRouter(history)
  });
  const enhancer = compose(applyMiddleware(routerMiddleware(history), saga));
  const store = createStore(rootReducer, enhancer);
  saga.run(rootSaga);
  return store;
}

