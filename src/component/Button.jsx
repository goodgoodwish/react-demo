import glamorous from 'glamorous'
import { Link as RRLink } from 'react-router-dom'
import { css } from 'glamor'

export const StyledLikeButton = css({
  fontSize: '16px',
  cursor: 'pointer',
  borderRadius: '1.25em',
  display: 'inline-block',
  padding: '0.625em 1em',
  fontWeight: '500',
  letterSpacing: '0.4px',
  border: 'none',
  color: 'white',
  textDecoration: 'none',
  backgroundColor: '#458ffd',
})

export const Button = glamorous.button(StyledLikeButton)
export const A = glamorous.a(StyledLikeButton)
export const Link = glamorous(RRLink)(StyledLikeButton)
