import styles from './Cart.module.css'
import Link from 'next/link';

import { AiOutlineShopping, AiOutlineClose } from 'react-icons/ai';

import { useState, useEffect } from 'react';

import React from 'react'

const Cart = () => {

    // create event to trigger cart state to open!

    const [cart, setCart] = useState({ id: null, lines: [] });
    const [cartOpen, setCartOpen] = useState(false);

// get cart
    useEffect(() => {
      
        const getCart = async () => {

            let localCartData = JSON.parse(
                window.localStorage.getItem('koopiBlock:shopify:cart')
            );

            if (localCartData) {

                const cartObj = localCartData

                const exsitingCart = await fetch(`/api/load-cart?cartId=${cartObj.cartId}`
                ).then((res) => res.json())

                setCart({
                    id: localCartData.cartId,
                    checkoutUrl: localCartData.checkoutUrl,
                    estimatedCost: exsitingCart.body.cart.estimatedCost.totalAmount,
                    lines: exsitingCart.body.cart.lines?.edges,
                })

                console.log(exsitingCart.body.cart.estimatedCost.totalAmount)
 
                return;           

                
            }

            localCartData = await fetch('http://localhost:3000/api/create-cart').then((res) => res.json()) 

            console.log(localCartData)

            setCart({
                id: localCartData.cartId,
                checkoutUrl: localCartData.checkoutUrl,
                estimatedCost: null,
                lines: [],
            })

            window.localStorage.setItem(
                'koopiBlock:shopify:cart',
                JSON.stringify(localCartData),
              );
        }

        getCart();

        const interval = setInterval(() => {

            const state = window.localStorage.getItem('koopiBlock:shopify:status');
      
            if (state && state === 'dirty') {
              getCart();
              window.localStorage.setItem('koopiBlock:shopify:status', 'clean');
            }

          }, 500);
        
        return () => clearInterval(interval);

    }, [])
    

    const toggleCart = () => {
        setCartOpen(!cartOpen);
        console.log(cart)
    }

    console.log(cart)

    

  return (
    <div>
        <div>
            { cartOpen ?        
                <div className={styles.logoContainer} onClick={toggleCart}> 
                    <AiOutlineClose />
                </div>        
            :
                <div className={styles.logoContainer} onClick={toggleCart}>
                    <AiOutlineShopping />
                </div>
            }
        </div>
        <div>
            { cartOpen && 
                <div className={styles.cartContainer}>
                    <h1 className={styles.title}>
                        הסלסלה שלך
                    </h1>
                    <ul className={styles.list}>
                        {cart.lines.map(({ node: item }) => (
                            <li className={styles.listItem} key={item.merchandise?.product?.title}>
                                <p className={styles.product}>
                                    {item.quantity} &times; {item.merchandise?.product?.title}
                                </p>
                            </li>
                        ))}
                        <li className={styles.listItem}>
                            <p className={styles.totalPrice}>Total: {cart.estimatedCost?.amount} </p>
                        </li>
                    </ul>
                    <div className={styles.buttonContainer}>
                        <Link className={styles.ctaButton} href={`${cart.checkoutUrl}`}>
                            Checkout  
                        </Link>
                    </div>
                </div>
                
            }    
        </div>              
    </div>
    

  )
}

export default Cart