// Redux store,
import { applyMiddleware, createStore, combineReducers, compose } from 'redux'

import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
// import promise from "redux-promise-middleware"

import books from '../book/book_redux'
import tools from '../tool/tool_redux'
const reducer = combineReducers({
  books,
  tools,
})

// const middleware = applyMiddleware(promise(), thunk, createLogger())
const middleware = compose(
  applyMiddleware(thunk, createLogger()),
  // If you are using the devToolsExtension, you can add it here also
  typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f
)

export default createStore(reducer, {}, middleware)
