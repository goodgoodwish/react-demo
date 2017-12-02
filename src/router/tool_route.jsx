import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Tool from '../tool/tool'
import ToolProfile from '../tool/tool_profile'

// The Tool component matches one of two different routes
// depending on the full pathname
export const ToolRoute = props => (
  <Switch>
    <Route exact path={props.match.path} component={Tool} />
    <Route path={`${props.match.path}/:toolId`} component={ToolProfile} />
  </Switch>
)

export default ToolRoute
