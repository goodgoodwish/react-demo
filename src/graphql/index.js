import { ApolloClient, createNetworkInterface, gql } from 'react-apollo'

// See: https://stackoverflow.com/a/15724300
function getCookie(name) {
  let value = '; ' + document.cookie
  let parts = value.split('; ' + name + '=')
  if (parts.length === 2) {
    return parts
      .pop()
      .split(';')
      .shift()
  }
}

const networkInterface = createNetworkInterface({
  uri: '/api/graphql',
  opts: {
    credentials: 'same-origin',
  },
})

// From: http://dev.apollodata.com/react/auth.html#Header
networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {} // Create the header object if needed.
      }
      // get the authentication token from local storage if it exists
      const token = getCookie('_token')
      req.options.headers['x-csrf-token'] = token
      next()
    },
  },
])

export const client = new ApolloClient({ networkInterface })

/**
 * Run a query to determine 1) if the user is logged in, and 2) if the user has admin
 * access. If neither condition is met; the promise is rejected, otherwise it resolved 'true'
 */
export function checkApiForPermission() {
  return client
    .query({
      query: gql('{ me { isAdmin } }'),
    })
    .then(result => {
      if (result.data.me.isAdmin !== true) {
        throw new Error('not admin')
      }
      return result.data.me.isAdmin
    })
}
