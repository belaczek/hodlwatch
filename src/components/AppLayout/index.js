import React, { Fragment } from 'react'
import NavbarContainer from 'containers/NavbarContainer'
import Footer from 'components/Footer'
import ModalContainer from 'containers/ModalContainer/'
import { ToastContainer } from 'react-toastify'

/**
 * Main screen wrapper
 */
const AppLayout = ({ children }) => (
  <Fragment>
    <NavbarContainer />
    {children}
    <Footer />
    <ModalContainer />
    <ToastContainer />
  </Fragment>
)

export default AppLayout
