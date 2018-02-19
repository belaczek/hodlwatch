import React from 'react'
import {
  Navbar,
  Container,
  NavbarBrand,
  NavbarItem,
  Button,
  NavbarEnd,
  NavbarBurger,
  NavbarMenu,
  NavbarLink
} from 'bloomer'
import { compose, withHandlers } from 'recompose'
import { connect } from 'react-redux'

import { appName } from 'appConstants'
import { serviceWorkerIsUpdatedSelector } from 'store/selectors'

const renderNavbar = ({ showUpdate, refresh }) => (
  <Navbar isTransparent className="is-light">
    <Container>
      <NavbarBrand>
        <NavbarItem>
          <strong>{appName}</strong>
        </NavbarItem>
        {showUpdate && (
          <NavbarItem>
            <Button isSize="small" isColor="warning" onClick={refresh}>
              UPDATE APP
            </Button>
          </NavbarItem>
        )}
        <NavbarBurger />
      </NavbarBrand>
      <NavbarMenu>
        <NavbarEnd>
          <NavbarLink href="#">Options</NavbarLink>
        </NavbarEnd>
      </NavbarMenu>
    </Container>
  </Navbar>
)

export default compose(
  connect(store => ({ showUpdate: serviceWorkerIsUpdatedSelector(store) })),
  withHandlers({
    refresh: () => () => window.location.reload()
  })
)(renderNavbar)
