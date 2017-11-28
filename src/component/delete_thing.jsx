import React, { Component } from 'react'
import { Div } from 'glamorous'
import Modal from './modal'

export default class DeleteThing extends Component {
  deleteAndHide = () => {
    const { deleteAction, hideAlert } = this.props
    deleteAction()
    hideAlert()
  }

  render() {
    const { alertMessage, hideAlert } = this.props

    return (
      <div>
        <Modal>
          <Div css={{ backgroundColor: 'white', padding: '2em' }}>
            <h4>Confirm Delete</h4>
            <p>{alertMessage}</p>
            <p>You will not be able to undo this action.</p>
            <hr />
            <button onClick={hideAlert}>No</button>
            <button onClick={this.deleteAndHide}>Yes, Remove</button>
          </Div>
        </Modal>
      </div>
    )
  }
}
