import React from 'react'
import {
  Navbar,
  Container,
  NavbarBrand,
  NavbarItem,
  Button,
  NavbarEnd,
  NavbarBurger,
  NavbarMenu
} from 'bloomer'
import { appName } from 'appConstants'

const AppNavbar = ({
  showUpdate,
  refresh,
  burgerIsActive,
  handleToggleBurgerMenu,
  openSettingsModal
}) => (
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
        <NavbarBurger isActive={burgerIsActive} onClick={openSettingsModal} />
      </NavbarBrand>
      <NavbarMenu isActive={burgerIsActive} onClick={handleToggleBurgerMenu}>
        <NavbarEnd>
          <NavbarItem href="#/" onClick={openSettingsModal}>
            Settings
          </NavbarItem>
        </NavbarEnd>
      </NavbarMenu>
    </Container>
  </Navbar>
)

export default AppNavbar
