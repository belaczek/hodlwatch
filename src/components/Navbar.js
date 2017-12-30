import React from 'react'
import { Navbar, Container, NavbarBrand, NavbarItem, Button } from 'bloomer'
import { compose, withHandlers } from 'recompose'
import { connect } from 'react-redux'

import { appName } from 'src/constants'
import { getServiceWorker } from 'store/selectors'

const renderNavbar = ({ showUpdate, refresh }) => (
  <Navbar isTransparent className='is-light'>
    <Container>
      <NavbarBrand>
        <NavbarItem>
          <strong>{appName}</strong>
        </NavbarItem>
        {showUpdate && (
          <NavbarItem>
            <Button isSize='small' isColor='warning' onClick={refresh}>
              UPDATE APP
            </Button>
          </NavbarItem>
        )}
      </NavbarBrand>
    </Container>
  </Navbar>
)

export default compose(
  connect(store => ({ showUpdate: getServiceWorker(store) })),
  withHandlers({
    refresh: () => () => window.location.reload()
  })
)(renderNavbar)
