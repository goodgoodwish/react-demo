import glamorous from 'glamorous'
import { Link as RouterLink } from 'react-router-dom'
import { css } from 'glamor'

export const StyledButton = css({
  fontSize: '18px',
  cursor: 'pointer',
  borderRadius: '1em',
  display: 'inline-block',
  padding: '0.5em 1em',
  border: 'none',
  color: 'white',
  textDecoration: 'none',
  backgroundColor: 'goldenrod',
})

export const Button = glamorous.button(StyledButton)
export const A = glamorous.a(StyledButton)
export const Link = glamorous(RouterLink)(StyledButton)
