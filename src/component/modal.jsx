import React from 'react'
import ReactDOM from 'react-dom'
import glamorous from 'glamorous'

export const FloatBox = glamorous.div({
  backgroundColor: 'rgba(0,0,0,0.4)',
  position: 'fixed',
  height: '100%',
  width: '100%',
  top: '0',
  left: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})

const modalRoot = document.getElementById('modal-root')

class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.el = document.createElement('div')
    this.state = {
      showModal: true,
    }
  }

  componentDidMount() {
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(
      this.state.showModal && <FloatBox>{this.props.children}</FloatBox>,
      this.el
    )
  }
}

export default Modal
