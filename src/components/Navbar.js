import React from 'react'
import { appName } from '../constants'
import { Navbar, Container, NavbarBrand, NavbarItem } from 'bloomer'

export default () => (
  <Navbar isTransparent className='is-light'>
    <Container>
      <NavbarBrand>
        <NavbarItem>
          <strong>{appName}</strong>
        </NavbarItem>
      </NavbarBrand>
    </Container>
  </Navbar>
)
