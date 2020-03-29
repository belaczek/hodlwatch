import React from "react";
import {
  Navbar,
  Container,
  NavbarBrand,
  NavbarItem,
  Button,
  NavbarEnd,
  NavbarBurger,
  NavbarMenu,
} from "bloomer";
import { APP_NAME } from "appConstants";

const AppNavbar = ({
  showUpdate,
  showBackButton = true,
  refresh,
  isActiveFilter,
  handleResetFilter,
  burgerIsActive,
  handleToggleBurgerMenu,
  openSettingsModal,
}) => (
  <Navbar isTransparent className="is-light">
    <Container>
      <NavbarBrand>
        <NavbarItem>
          <strong>{APP_NAME}</strong>
        </NavbarItem>
        {isActiveFilter && (
          <NavbarItem>
            <Button
              isOutlined
              isSize="small"
              isColor="black"
              onClick={handleResetFilter}
            >
              back to all
            </Button>
          </NavbarItem>
        )}
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
            Options
          </NavbarItem>
        </NavbarEnd>
      </NavbarMenu>
    </Container>
  </Navbar>
);

export default AppNavbar;
