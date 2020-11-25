import { createStore, applyMiddleware } from 'redux'
import thunkMiddleWare from 'redux-thunk'
import { initial, reducer } from './modules/grid'

export function initStore (state = initial) {
  return createStore(reducer, state, applyMiddleware(thunkMiddleWare))
}

const store = initStore()
export default store
