import { client } from '../graphql'
import { gql } from 'react-apollo'
import { PENDING, FULFILLED, REJECTED } from '../redux/config'

// Actions
const FETCH_BOOK = 'my-app/book/FETCH_BOOK'
const CREATE = 'my-app/book/CREATE'
const UPDATE = 'my-app/book/UPDATE'
const REMOVE = 'my-app/book/REMOVE'
const CLEAR = 'my-app/book/CLEAR'
const SELECT_FIRST_BOOK = 'my-app/book/SELECT_FIRST_BOOK'
const SELECT_BOOK = 'my-app/book/SELECT_BOOK'

// Reducer
const initialState = {
  fetched: true,
  fetching: false,
  UI: {
    currBookId: '',
  },
  books: {
    book1: {
      name: "Rework",
      intro: "Most business books give you the same old advice: write a business plan, study the competition, seek investors, yadda yadda. If you're looking for a book like that, put this one back on the shelf. REWORK is the perfect playbook for anyone who’s ever dreamed of doing it on their own. Entrepreneurs, small-business owners, and artists who don’t want to starve will all find valuable guidance in these pages.",
    },
    book2: {
      name: "7 habits",
      intro: "Good wish",
    },
    book3: {
      name: "Grokking Algorithms",
      intro: "Grokking Algorithms: An illustrated guide for programmers and other curious people",
    },
  },
}

function composedAssignmentId(bookId, userId) {
  return `${bookId} - ${userId}`
}

export default function reducer(state = initialState, action) {
  function selectFirstItem() {
    const itemKeys = Object.keys(state.books)
    if (itemKeys.length > 0) {
      const bookId = itemKeys[0]
      state = {
        ...state,
        UI: { ...state.UI, currBookId: bookId },
      }
    }
  }

  switch (action.type) {
    case FETCH_BOOK + FULFILLED:
      let books = {}
      action.nodes.forEach(function(item) {
        books[item.id] = { name: item.name, intro: item.intro }
      })
      state = {
        ...state,
        books: books,
      }
      break
    case FETCH_BOOK + PENDING:
      state = {
        ...state,
        fetching: true,
        fetched: false,
      }
      break
    case FETCH_BOOK + REJECTED:
      state = {
        ...state,
        fetching: false,
        fetched: true,
      }
      break
    case CREATE + PENDING:
      break
    case CREATE + FULFILLED:
      state = {
        ...state,
        books: { ...state.books, [action.bookId]: action.book },
      }
      break
    case CREATE + REJECTED:
      break
    case UPDATE + PENDING:
      break
    case UPDATE + FULFILLED:
      state = {
        ...state,
        books: { ...state.books, [action.bookId]: action.book },
      }
      break
    case UPDATE + REJECTED:
      break
    case REMOVE + PENDING:
      break
    case REMOVE + FULFILLED:
      let newBooks = { ...state.books }
      delete newBooks[action.bookId]
      state = {
        ...state,
        books: newBooks,
      }
      selectFirstItem()
      break
    case REMOVE + REJECTED:
      break
    case CLEAR:
      state = { ...state, books: {} }
      break
    case SELECT_FIRST_BOOK:
      selectFirstItem()
      break
    case SELECT_BOOK:
      state = {
        ...state,
        UI: { ...state.UI, currBookId: action.bookId },
      }
      break
    default:
      break
  }
  return state
}

// Action Creators
export function fetchBook() {
  // return a thunk, from dispatching thunk middleware,
  return function(dispatch) {
    dispatch({ type: FETCH_BOOK + PENDING })

    const bookListQuery = gql`
      query BookListQuery {
        books(pageSize: 5) {
          hasMoreResults
          pageToken
          nodes {
            id
            name
            intro
          }
        }
      }
    `
    client
      .query({
        query: bookListQuery,
      })
      .then(function(data) {
        dispatch(loadBook(data.data.books.nodes))
      })
      .catch(function(err) {
        dispatch({
          type: FETCH_BOOK + REJECTED,
          payload: err,
        })
      })
  }
}

export function loadBook(nodes) {
  return { type: FETCH_BOOK + FULFILLED, nodes }
}

export function createBook({ id, name, intro }) {
  return dispatch => {
    const book = { name, intro }
    dispatch({
          type: CREATE + FULFILLED,
          bookId: id,
          book,
    })
  }
}

export function createBookGql({ name, intro }) {
  return dispatch => {
    dispatch({ type: CREATE + PENDING })
    const mutateQuery = gql`
      mutation CreateNewBook($name: String!, $intro: String!) {
        createBook(name: $name, intro: $intro) {
          id
          name
          intro
        }
      }
    `
    const vars = {
      name: name,
      intro,
    }
    client
      .mutate({
        mutation: mutateQuery,
        variables: vars,
      })
      .then(data => {
        const book = data.data.createBook
        dispatch({
          type: CREATE + FULFILLED,
          bookId: createBook.id,
          book,
        })
      })
      .catch(error => {
        dispatch({ type: CREATE + REJECTED, error })
      })
  }
}

export function updateBook({ bookId, name, intro }) {
  return dispatch => {
    dispatch({ type: UPDATE + PENDING, payload: { bookId, name, intro } })
    const mutateQuery = gql`
      mutation($bookId: String!, $name: String!, $intro: String!) {
        updateBook(bookId: $bookId, name: $name, intro: $intro) {
          id
          name
          intro
        }
      }
    `
    const vars = {
      bookId,
      name,
      intro,
    }
    client
      .mutate({
        mutation: mutateQuery,
        variables: vars,
      })
      .then(data => {
        const book = data.data.updateBook
        dispatch({
          type: UPDATE + FULFILLED,
          bookId: book.id,
          book,
        })
      })
      .catch(error => {
        dispatch({ type: UPDATE + REJECTED, error })
      })
  }
}

export function clearBook() {
  return { type: CLEAR }
}

export function removeBook(id) {
  return dispatch => {
    dispatch({ type: REMOVE + PENDING })

    const mutateQuery = gql`
      mutation($bookId: String!) {
        removeBook(bookId: $bookId)
      }
    `

    client
      .mutate({
        mutation: mutateQuery,
        variables: { bookId: id },
      })
      .then(function(data) {
        dispatch({
          type: REMOVE + FULFILLED,
          bookId: id,
        })
      })
      .catch(error => {
        dispatch({ type: REMOVE + REJECTED, error })
      })
  }
}

export function selectBook(bookId) {
  return { type: SELECT_BOOK, bookId }
}
