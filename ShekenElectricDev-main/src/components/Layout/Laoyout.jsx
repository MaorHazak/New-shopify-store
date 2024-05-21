import Head from 'next/head'
import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

import styles from './Layout.module.css'


const Layout = ({ children }) => {

    const [cartOpen, setCartOpen] = useState(false)

    const toggleCartOpen = () => {
        setCartOpen(true)
    }

    console.log(cartOpen)

  return ( 
    <div className={styles.layout}>
        <Head>
            <title>My Shop</title>
        </Head>
        <header className={styles.stickyNavbar}>
            <Navbar />
        </header>
        <main>
            {React.Children.map(children, child => {
                return React.cloneElement(child, { cartOpen: cartOpen });
            })}
        </main>
        <footer>
            <Footer />
        </footer>
    </div>
  )
}

export default Layout