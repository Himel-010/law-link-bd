import React from 'react'
import { Outlet } from "react-router-dom"
import Header from '../Navbar/Navbar'
import FooterComponent from '../Footer/Footer'
import Chatbot from '../Chatbot/Chatbot'

function Layout() {
  return (
    <>
      <Header/>
      <Outlet/>
      <Chatbot/>
      <FooterComponent/>
    </>
  )
}

export default Layout
