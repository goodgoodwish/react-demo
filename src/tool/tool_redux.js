import { client } from '../graphql'
import { gql } from 'react-apollo'
import { PENDING, FULFILLED, REJECTED } from '../redux/config'

// Actions
const FETCH_TOOL = 'my-app/tool/FETCH_TOOL'
const CREATE = 'my-app/tool/CREATE'
const UPDATE = 'my-app/tool/UPDATE'
const REMOVE = 'my-app/tool/REMOVE'
const CLEAR = 'my-app/tool/CLEAR'
const SELECT_FIRST_TOOL = 'my-app/tool/SELECT_FIRST_TOOL'
const SELECT_TOOL = 'my-app/tool/SELECT_TOOL'

// Reducer
const initialState = {
  fetched: true,
  fetching: false,
  UI: {
    currToolId: '',
  },
  tools: {
    tool1: {
      name: "apollo_concept",
      photo: "apollo_concept.png",
      code: `query ToolListQuery {
        books(pageSize: 5) {
          hasMoreResults
          pageToken
          nodes {
            id
            name
            photo
          }
        }
      }`,
    },
    tool2: {
      name: "apollo_server",
      photo: "apollo_server.png",
      code: ``,
    },
    tool3: {
      name: "Rest_vs_GraphQL",
      photo: "Rest_vs_GraphQL.png",
      code: ``,
    },
    tool_4: {
      name: "redux-saga: Non-blocking_Saga",
      photo: "Non-blocking_Saga.png",
      code: `const [flight, forecast] = yield [call(loadFlight, departure.flightID), call(loadForecast, departure.date)];`,
    },
    tool_n: {
      name: "",
      photo: "",
      code: ``,
    },
    tool_n2: {
      name: "",
      photo: "",
      code: ``,
    },
    tool_n1: {
      name: "",
      photo: "",
      code: ``,
    },
  },
}

export default function reducer(state = initialState, action) {
  function selectFirstItem() {
    const itemKeys = Object.keys(state.tools)
    if (itemKeys.length > 0) {
      const toolId = itemKeys[0]
      state = {
        ...state,
        UI: { ...state.UI, currToolId: toolId },
      }
    }
  }

  switch (action.type) {
    case FETCH_TOOL + FULFILLED:
      let tools = {}
      action.nodes.forEach(function(item) {
        tools[item.id] = { name: item.name, description: item.description }
      })
      state = {
        ...state,
        tools: tools,
      }
      break
    case FETCH_TOOL + PENDING:
      state = {
        ...state,
        fetching: true,
        fetched: false,
      }
      break
    case FETCH_TOOL + REJECTED:
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
        tools: { ...state.tools, [action.toolId]: action.tool },
      }
      break
    case CREATE + REJECTED:
      break
    case UPDATE + PENDING:
      break
    case UPDATE + FULFILLED:
      state = {
        ...state,
        tools: { ...state.tools, [action.toolId]: action.tool },
      }
      break
    case UPDATE + REJECTED:
      break
    case REMOVE + PENDING:
      break
    case REMOVE + FULFILLED:
      let newTools = { ...state.tools }
      delete newTools[action.toolId]
      state = {
        ...state,
        tools: newTools,
      }
      selectFirstItem()
      break
    case REMOVE + REJECTED:
      break
    case CLEAR:
      state = { ...state, tools: {} }
      break
    case SELECT_FIRST_TOOL:
      selectFirstItem()
      break
    case SELECT_TOOL:
      state = {
        ...state,
        UI: { ...state.UI, currToolId: action.toolId },
      }
      break
    default:
      break
  }
  return state
}

// Action Creators
export function fetchTool() {
  // return a thunk, from dispatching thunk middleware,
  return function(dispatch) {
    dispatch({ type: FETCH_TOOL + PENDING })

    const toolListQuery = gql`
      query ToolListQuery {
        tools(pageSize: 5) {
          hasMoreResults
          pageToken
          nodes {
            id
            name
            description
          }
        }
      }
    `
    client
      .query({
        query: toolListQuery,
      })
      .then(function(data) {
        dispatch(loadTool(data.data.tools.nodes))
      })
      .catch(function(err) {
        dispatch({
          type: FETCH_TOOL + REJECTED,
          payload: err,
        })
      })
  }
}

export function loadTool(nodes) {
  return { type: FETCH_TOOL + FULFILLED, nodes }
}

export function createTool({ id, name, code }) {
  return dispatch => {
    const tool = { name, code }
    dispatch({
          type: CREATE + FULFILLED,
          toolId: id,
          tool,
    })
  }
}

export function createToolGql({ name, description }) {
  return dispatch => {
    dispatch({ type: CREATE + PENDING })
    const mutateQuery = gql`
      mutation CreateNewTool($name: String!, $description: String!) {
        createTool(name: $name, description: $description) {
          id
          name
          description
        }
      }
    `
    const vars = {
      name: name,
      description,
    }
    client
      .mutate({
        mutation: mutateQuery,
        variables: vars,
      })
      .then(data => {
        const tool = data.data.createTool
        dispatch({
          type: CREATE + FULFILLED,
          toolId: createTool.id,
          tool,
        })
      })
      .catch(error => {
        dispatch({ type: CREATE + REJECTED, error })
      })
  }
}

export function updateTool({ toolId, name, description }) {
  return dispatch => {
    dispatch({ type: UPDATE + PENDING, payload: { toolId, name, description } })
    const mutateQuery = gql`
      mutation($toolId: String!, $name: String!, $description: String!) {
        updateTool(toolId: $toolId, name: $name, description: $description) {
          id
          name
          description
        }
      }
    `
    const vars = {
      toolId,
      name,
      description,
    }
    client
      .mutate({
        mutation: mutateQuery,
        variables: vars,
      })
      .then(data => {
        const tool = data.data.updateTool
        dispatch({
          type: UPDATE + FULFILLED,
          toolId: tool.id,
          tool,
        })
      })
      .catch(error => {
        dispatch({ type: UPDATE + REJECTED, error })
      })
  }
}

export function clearTool() {
  return { type: CLEAR }
}

export function removeTool(id) {
  return dispatch => {
        dispatch({
          type: REMOVE + FULFILLED,
          toolId: id,
        })
  }
}
export function removeToolGql(id) {
  return dispatch => {
    dispatch({ type: REMOVE + PENDING })

    const mutateQuery = gql`
      mutation($toolId: String!) {
        removeTool(toolId: $toolId)
      }
    `

    client
      .mutate({
        mutation: mutateQuery,
        variables: { toolId: id },
      })
      .then(function(data) {
        dispatch({
          type: REMOVE + FULFILLED,
          toolId: id,
        })
      })
      .catch(error => {
        dispatch({ type: REMOVE + REJECTED, error })
      })
  }
}

export function selectTool(toolId) {
  return { type: SELECT_TOOL, toolId }
}
