import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import glamorous, { Table, Th, Tr, Td, Div, Span, Input } from 'glamorous'
import { bindActionCreators } from 'redux'
import * as toolActions from './tool_redux'


export class ToolProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toolId: 'tool_18',
      name: 'Python guide',
      code: 'A new tool for new python programming',
      photo: 'abc.jpg',
    }
    this.changeInput = this.changeInput.bind(this)
  }

  componentWillMount() {
  	if (this.props.match === undefined) { return }

    const { toolId } = this.props.match.params
    const tool = this.props.tools[toolId]
    const {name, code, photo} = tool
    if (toolId && tool) {
	    this.setState({
	      toolId, name, code, photo
	    })
    }
  }

  componentWillReceiveProps(nextProps) {
  	if (this.props.toolId === nextProps.toolId) { return }
    const {toolId} = nextProps;
  	// return
    // debugger
    const {name, code, photo} = nextProps.tools[toolId]
    this.setState({
      toolId, name, code, photo
    })
  }

  changeInput(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const elementName = target.name

    this.setState({
      [elementName]: value,
    })
  }

  createTool = (event) => {
  	event.preventDefault();
  	const { toolId: id, name, code } = this.state
  	console.log('id: ', id)
    this.props.createTool({ id, name, code })
  }

  deleteTool = (event) => {
  	event.preventDefault();
    const { toolId } = this.state
    this.props.removeTool(toolId)
  }

  render() {
    const { tools, UI } = this.props

    return (
      <div>
        <glamorous.Form>
	        <glamorous.Div css={{display:'flex', alignItems: 'flex-start', flexWrap: 'wrap' }} >
	        <label>
	          Tool ID:
	          <input
	            name="toolId"
	            value={this.state.toolId}
	            onChange={this.changeInput} />
	        </label>
	        <label>
	          Tool Name:
	          <input
	            name="name"
	            value={this.state.name}
	            onChange={this.changeInput} />
	        </label>
	        <label>
	          Code:
	          <textarea
	            name="code"
	            value={this.state.code} rows='5' cols='50'
	            onChange={this.changeInput} />
	        </label>
	        </glamorous.Div>
	        <button onClick={this.createTool} >Save</button>
	        <button onClick={this.deleteTool} >Delete</button>
	      </glamorous.Form>
	      photo: <span>{this.state.photo}</span>
	      <div>
	      	<img src={"/tool_img/" + this.state.photo} alt={this.state.photo} 
	      	  width="100%" height="100%"
	      	/>
	      </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ToolProfile)
