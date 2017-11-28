import React, { Component } from 'react'
import { connect } from 'react-redux'
import glamorous, { Table, Th, Tr, Td, Div, Span, Input } from 'glamorous'

import { removeBook, createBook } from './book_redux'
import { Button } from '../component/Button'

// component & container
// component part

export const SearchIcon = () => (
  <svg
    fill="currentColor"
    height="20"
    viewBox="0 0 24 24"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)

export const BookGrid = glamorous.div({
  display: 'grid',
  gridTemplateColumns: '1fr 4fr 1fr',
  gridTemplateRows: '3fr 10fr 1fr',
  backgroundColor: 'white',
  fontSize: '16px',
})

const Box = glamorous.div({
  backgroundColor: 'azure',
  textAlign: 'left',
})

const Title = glamorous(Box)({
  gridColumn: '2 / span 1',
  gridRow: '1 / span 1',
})

const Header1 = glamorous.span({
  fontSize: '42px',
  marginTop: '1em',
  marginBottom: '1em',
})

const SearchInput = glamorous.input({
  flex: '0, 1, auto',
  fontSize: '18px',
  color: 'saddlebrown',
  marginBottom: '1em',
  border: 'none',
  '&:focus, &:active, &:hover': {
    outline: 'none',
  },
})

const BookListRow = glamorous.tr({
  backgroundColor: 'honeydew',
  boxShadow: '0 0 4px 0 rgba(120, 120, 120, 0.5)',
  transition: '.5s ease all',
  ':hover': {
    backgroundColor: 'lavenderblush',
  },
})

const BookListColumn = glamorous.td({
  padding: '0.5em 1em 0.5em 0.2em',
  xmargin: '1em',
  fontSize: '14px',
  color: 'brown',
})

const ToggleButton = glamorous.button({
  xborder: 'none',
  background: 'none',
  '&:focus, &:active, &:hover': {
    outline: 'none',
  },
})

const Content = glamorous.section({
  gridColumn: '2 / span 1',
  gridRow: '2 / span 1',
})

const Footer = glamorous.footer({
  gridColumn: '1 / span 3',
  gridRow: '3 / span 1',
})

export class Book extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bookId: 'book_18',
      name: 'Python guide',
      intro: 'A new book for new python programming',
      isZoomOn: false,
      bookFilter: '',
    }
    this.changeInput = this.changeInput.bind(this)
  }

  changeInput(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const elementName = target.name

    this.setState({
      [elementName]: value,
    })
  }

  createBook = ({ id, name, intro }) => {
    this.props.dispatch(createBook({ id, name, intro }))
  }

  deleteBook = () => {
    const { bookId } = this.state
    this.props.dispatch(removeBook(bookId))
  }

  toggleZoom = (id, book) => {
    // hide UserZoom comp when click other row,
    if (id !== this.state.bookId) {
      this.setState({
        bookId: id,
        name: book.name,
        intro: book.intro,
        isZoomOn: true,
      })
    } else {
      this.setState({
        isZoomOn: !this.state.isZoomOn,
      })
    }
  }

  render() {
    const { books, UI } = this.props
    const ZoomTbody = glamorous.tbody({})

    let bookRows = Object.keys(books)
      .filter(val => {
        if (this.state.bookFilter === '') {
          return true
        }
        const bookName = books[val].name.toUpperCase()
        return bookName.indexOf(this.state.bookFilter.toUpperCase()) >= 0
      })
      .sort((a, b) => {
        const nameA = books[a].name.toUpperCase()
        const nameB = books[b].name.toUpperCase()
        if (nameA < nameB) {
          return -1
        } else {
          return 1
        }
      })
      .map(val => {
        const zoomLetter = this.state.isZoomOn && val === this.state.bookId ? '^': 'v'
        return (
          <ZoomTbody key={val}>
            <BookListRow>
              <BookListColumn>
                {val}
              </BookListColumn>
              <BookListColumn>
                {books[val].name}
              </BookListColumn>
              <BookListColumn>
                {books[val].intro}
              </BookListColumn>

              <td>
                <ToggleButton onClick={() => this.toggleZoom(val, books[val])}>
                  {zoomLetter}
                </ToggleButton>
              </td>
              <div>
                {this.state.isZoomOn &&
                  val === this.state.bookId && (
                    <h1>Something show </h1>
                  )}
              </div>
            </BookListRow>
          </ZoomTbody>
        )
      })

    return (
      <BookGrid>
        <Box />
        <Box />
        <Title css={{}}>
          <Div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Header1>Books</Header1>
          </Div>
          <glamorous.Span
            css={{ display: 'flex', color:'darkolivegreen', marginBottom: '1em' }}
          >
            <SearchIcon />
            <SearchInput
              name="bookFilter"
              value={this.state.bookFilter}
              onChange={this.changeInput}
              placeholder="Filter Books by name or intro"
              size="40"
            />
          </glamorous.Span>
        </Title>
        <Content css={{ marginBottom: '1em' }}>
          <glamorous.Table
            css={{
              marginTop: '8px',
              marginBottom: '8px',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr>
                <glamorous.Th css={{ paddingRight: '1em' }}>Book_ID</glamorous.Th>
                <th>Name</th>
                <th>Intro</th>
              </tr>
            </thead>
            {bookRows}
          </glamorous.Table>
        </Content>
        <Footer
          css={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Span css={{ marginRight: '1em' }}>‹ Prev</Span>
          <Span css={{ marginRight: '1em' }}>Next ›</Span>
        </Footer>
      </BookGrid>
    )
  }
}

// container part
const mapStateToProps = (state, ownProps) => {
  return {
    UI: state.books.UI,
    books: state.books.books,
  }
}

export default connect(mapStateToProps)(Book)
