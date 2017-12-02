import React, { Component } from 'react'
import glamorous from 'glamorous'
import { connect } from 'react-redux'
// import { fetchBook } from '../book/book_redux'
import { Home } from './home'
import Book from '../book/book'
import ToolRoute from '../router/tool_route'

import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

const About = () => (
  <h1>About</h1>
)

const MenuLink = glamorous(NavLink)({
  margin: '1em',
  fontSize: '18px',
  textDecoration: 'none',
})

const BasicExample = () => (
  <Router>
    <RootFormat>
      <glamorous.Div css={{display: 'flex'}} >
          <MenuLink to="/">Home</MenuLink>
          <MenuLink to="/book">Book</MenuLink>
          <MenuLink to="/about">About</MenuLink>
          <MenuLink to="/tool">Tool</MenuLink>
      </glamorous.Div>

      <glamorous.Div css={{backgroundColor: 'beige'}} >
        <Route exact path="/" component={Home} />
        <Route path="/book" component={Book} />
        <Route path="/about" component={About} />
        <Route path="/tool" component={ToolRoute} />
      </glamorous.Div>
    </RootFormat>
  </Router>
);

export const RootFormat = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  background: 'aliceblue',
  fontFamily: '',
  fontSize: '18px',
  height: '100%',
})

// The Init component loading data into Redux from GraphQL.
export class Layout extends Component {
  componentDidMount() {
    // this.props.dispatch(fetchBook())
    // this.props.dispatch(fetchAuthor())
  }

  render() {
    if (!this.props.fetched) {
      return <div />
    }
    return (
      <BasicExample />
    )
  }
}

// container part
const mapStateToProps = (state, ownProps) => {
  return {
    fetched: state.books.fetched,
  }
}

export default connect(mapStateToProps)(Layout)
