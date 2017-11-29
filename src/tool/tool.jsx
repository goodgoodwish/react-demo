import React, { Component } from 'react'
import { connect } from 'react-redux'
import glamorous, { Table, Th, Tr, Td, Div, Span, Input } from 'glamorous'
import { bindActionCreators } from 'redux'
import * as toolActions from './tool_redux'
import ToolProfile from './tool_profile'

// component & container
// component part

export const ToolGrid = glamorous.div({
  padding: '5px',
  display: 'grid',
  gridColumnGap: '5px',
  gridRowGap: '5px',
  background: 'papayawhip',
  gridTemplateAreas: `
      "header header"
      "side-bar main-content"
      "side-bar footer"`,
  gridTemplateRows: '1fr 10fr 1fr',
  gridTemplateColumns: '1fr 2fr',
})

const Box = glamorous.div({
  backgroundColor: '',
  textAlign: 'left',
})

const Title = glamorous(Box)({
  gridArea: "header"
})

const Aside = glamorous.aside({
  gridArea: "side-bar"
})

const Content = glamorous.main({
  gridArea: "main-content"
})

const Footer = glamorous.footer({
  gridArea: "footer"
})


const ToolListRow = glamorous.li({
  display: 'flex',
  listStyle: 'none',
  margin: '0.2em 0',
  padding: '0.2em',
  backgroundColor: 'honeydew',
  boxShadow: '0 0 4px 0 rgba(120, 120, 120, 0.5)',
  transition: '.5s ease all',
  ':hover': {
    backgroundColor: 'lavenderblush',
  },
})

const ToolListColumn = glamorous.span({
  padding: '0.2em 0.5em',
  marginRight: '0.5em',
  fontSize: '14px',
  color: 'brown',
  xborder: '1px solid green'
})

export class Tool extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toolId: '',
      isZoomOn: false,
      toolFilter: '',
    }
    this.changeInput = this.changeInput.bind(this)
  }

  componentWillMount() {
    const keys = Object.keys(this.props.tools)
    if (keys.length > 0) {
      this.setState({toolId: keys[0]})
    }
  }

  changeInput(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const elementName = target.name

    this.setState({
      [elementName]: value,
    })
  }

  createTool = ({ id, name, code }) => {
    this.props.createTool({ id, name, code })
  }

  deleteTool = () => {
    const { toolId } = this.state
    this.props.removetool(toolId)
  }

  selectRow = (id) => {
    this.setState({toolId: id });
    console.log(id)
  }


  toggleZoom = (id, tool) => {
    // hide UserZoom comp when click other row,
    if (id !== this.state.toolId) {
      this.setState({
        toolId: id,
        name: tool.name,
        intro: tool.intro,
        isZoomOn: true,
      })
    } else {
      this.setState({
        isZoomOn: !this.state.isZoomOn,
      })
    }
  }

  render() {
    const { tools, UI } = this.props
    const currTag = '<=='

    let toolRows = Object.keys(tools)
      .filter(val => {
        if (this.state.toolFilter === '') {
          return true
        }
        const toolName = tools[val].name.toUpperCase()
        return toolName.indexOf(this.state.toolFilter.toUpperCase()) >= 0
      })
      .sort((a, b) => {
        const nameA = tools[a].name.toUpperCase()
        const nameB = tools[b].name.toUpperCase()
        if (nameA < nameB) {
          return -1
        } else {
          return 1
        }
      })
      .map(val => {
        const zoomLetter = this.state.isZoomOn && val === this.state.toolId ? '^': 'v'
        return (
            <ToolListRow key={val} onClick={()=>this.selectRow(val)} >
              <ToolListColumn>
                {val}
              </ToolListColumn>
              <ToolListColumn css={{}} >
                {tools[val].name}
              </ToolListColumn>
              <ToolListColumn css={{}} >
                {val === this.state.toolId && currTag}
              </ToolListColumn>
            </ToolListRow>
        )
      })

    return (
      <ToolGrid>
        <Box />
        <Box />
        <Title css={{}}>
        </Title>
        <Aside css={{}}>
          <ul>
            {toolRows}
          </ul>
        </Aside>
        <Content css={{ marginBottom: '1em' }}>
          <ToolProfile toolId={this.state.toolId} />
        </Content>
        <Footer>
          <span>‹ Prev</span>
          <span>Next ›</span>
        </Footer>
      </ToolGrid>
    )
  }
}

// container part
const mapStateToProps = (state, ownProps) => {
  return {
    UI: state.tools.UI,
    tools: state.tools.tools,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      ...toolActions,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Tool)
